/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { BallotBundleState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/ballot_bundle_pb';
import { CountingCircleResultState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';
import { DialogService, SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { OnDestroy, OnInit, Directive } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { ShortcutDialogComponent, ShortcutDialogData } from '../../components/ballot-shortcut-dialog/shortcut-dialog.component';
import {
  MajorityElectionResultBundles,
  PoliticalBusinessResultBundle,
  ProportionalElectionResultBundle,
  ProportionalElectionResultBundles,
  VoteResultBundles,
} from '../../models';
import { ResultExportService } from '../../services/result-export.service';
import { RoleService } from '../../services/role.service';
import { groupBy, groupBySingle } from '../../services/utils/array.utils';

@Directive()
export abstract class PoliticalBusinessBundleOverviewComponent<
  T extends ProportionalElectionResultBundles | MajorityElectionResultBundles | VoteResultBundles,
> implements OnInit, OnDestroy
{
  public result?: T;
  public resultReadOnly: boolean = true;
  public loading: boolean = true;
  public isErfassungUser: Observable<boolean>;

  public openBundles: PoliticalBusinessResultBundle[] | ProportionalElectionResultBundle[] = [];
  public reviewedBundles: PoliticalBusinessResultBundle[] | ProportionalElectionResultBundle[] = [];
  public deletedBundles: PoliticalBusinessResultBundle[] | ProportionalElectionResultBundle[] = [];

  private bundlesById: Record<string, PoliticalBusinessResultBundle | ProportionalElectionResultBundle> = {};

  private routeParamsSubscription?: Subscription;
  private bundleStateChangesSubscription?: Subscription;

  protected constructor(
    roleService: RoleService,
    protected readonly i18n: TranslateService,
    protected readonly toast: SnackbarService,
    protected readonly dialog: DialogService,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly themeService: ThemeService,
    protected readonly resultExportService: ResultExportService,
  ) {
    this.isErfassungUser = roleService.isErfassungUser;
  }

  public ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(params => this.loadData(params));
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
    this.bundleStateChangesSubscription?.unsubscribe();
  }

  public async back(): Promise<void> {
    if (!this.result) {
      return;
    }

    await this.router.navigate(
      [
        this.themeService.theme$.value,
        'contests',
        this.result.politicalBusinessResult.politicalBusiness.contestId,
        this.result.politicalBusinessResult.countingCircleId,
      ],
      {
        queryParams: {
          politicalBusinessId: this.result.politicalBusinessResult.politicalBusiness.id,
        },
      },
    );
  }

  public async openBundle({ id }: PoliticalBusinessResultBundle): Promise<void> {
    await this.router.navigate([id, 0], { relativeTo: this.route });
  }

  public async reviewBundle({ id }: PoliticalBusinessResultBundle): Promise<void> {
    await this.router.navigate([id, 'review'], { relativeTo: this.route });
  }

  public async deleteBundle(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (!this.result) {
      return;
    }

    const confirmed = await this.dialog.confirm(
      'POLITICAL_BUSINESS.BUNDLE_DELETE_CONFIRM.TITLE',
      'POLITICAL_BUSINESS.BUNDLE_DELETE_CONFIRM.MSG',
      'APP.DELETE',
    );
    if (!confirmed) {
      return;
    }

    await this.deleteBundleById(bundle.id);

    const oldState = bundle.state;
    bundle.state = BallotBundleState.BALLOT_BUNDLE_STATE_DELETED;
    this.moveBundle(bundle, oldState);
    this.toast.success(this.i18n.instant('APP.DELETED'));
  }

  public showShortcutDialog(): void {
    const data: ShortcutDialogData = {
      shortcuts: [
        {
          text: 'POLITICAL_BUSINESS.SHORTCUT.NEW_BUNDLE.TEXT',
          combination: 'POLITICAL_BUSINESS.SHORTCUT.NEW_BUNDLE.COMBINATION',
        },
      ],
    };
    this.dialog.open(ShortcutDialogComponent, data);
  }

  protected abstract deleteBundleById(bundleId: string): Promise<void>;

  protected abstract loadBundles(resultId: string, params: Params): Promise<T>;

  protected abstract startChangesListener(
    resultId: string,
    params: Params,
  ): Observable<PoliticalBusinessResultBundle | ProportionalElectionResultBundle>;

  protected getUsedBundleNumbers(bundles: PoliticalBusinessResultBundle[]): number[] {
    return bundles.map(x => x.number);
  }

  protected getDeletedUnusedBundleNumbers(bundles: PoliticalBusinessResultBundle[]): number[] {
    const notDeletedBundleNumbers = bundles.filter(x => x.state !== BallotBundleState.BALLOT_BUNDLE_STATE_DELETED).map(x => x.number);
    return bundles
      .filter(x => x.state === BallotBundleState.BALLOT_BUNDLE_STATE_DELETED && !notDeletedBundleNumbers.includes(x.number))
      .map(x => x.number);
  }

  private async loadData(params: Params): Promise<void> {
    this.loading = true;
    try {
      this.bundleStateChangesSubscription?.unsubscribe();
      this.result = await this.loadBundles(params.resultId, params);

      this.bundlesById = groupBySingle(
        this.result.bundles,
        x => x.id,
        x => x,
      );
      this.updateBundleGroups();

      this.resultReadOnly =
        this.result.politicalBusinessResult.politicalBusiness.contest!.locked ||
        (this.result.politicalBusinessResult.state !== CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING &&
          this.result.politicalBusinessResult.state !== CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION);

      if (!this.resultReadOnly) {
        this.bundleStateChangesSubscription = this.startChangesListener(params.resultId, params).subscribe(x => this.bundleUpdated(x));
      }
    } finally {
      this.loading = false;
    }
  }

  private bundleUpdated(b: PoliticalBusinessResultBundle | ProportionalElectionResultBundle): void {
    if (!this.result) {
      return;
    }

    const bundle = this.bundlesById[b.id];
    if (!!bundle) {
      const oldState = bundle.state;
      Object.assign(this.bundlesById[b.id], b);
      this.moveBundle(b, oldState);
      return;
    }

    this.bundlesById[b.id] = b;
    this.result.bundles.push(b);
    this.moveBundle(b);
  }

  private updateBundleGroups(): void {
    if (!this.result) {
      return;
    }

    const grouped = groupBy(
      this.result.bundles,
      x => x.state,
      x => x,
    );
    this.openBundles = [
      ...(grouped[BallotBundleState.BALLOT_BUNDLE_STATE_READY_FOR_REVIEW] || []),
      ...(grouped[BallotBundleState.BALLOT_BUNDLE_STATE_IN_CORRECTION] || []),
      ...(grouped[BallotBundleState.BALLOT_BUNDLE_STATE_IN_PROCESS] || []),
    ];
    this.reviewedBundles = grouped[BallotBundleState.BALLOT_BUNDLE_STATE_REVIEWED] || [];
    this.deletedBundles = grouped[BallotBundleState.BALLOT_BUNDLE_STATE_DELETED] || [];
  }

  private moveBundle(bundle: PoliticalBusinessResultBundle, oldState?: BallotBundleState): void {
    if (oldState === BallotBundleState.BALLOT_BUNDLE_STATE_REVIEWED) {
      this.reviewedBundles = this.reviewedBundles.filter(x => x.id !== bundle.id);
    } else if (oldState !== undefined) {
      this.openBundles = this.openBundles.filter(x => x.id !== bundle.id);
    }

    switch (bundle.state) {
      case BallotBundleState.BALLOT_BUNDLE_STATE_REVIEWED:
        this.reviewedBundles = [bundle, ...this.reviewedBundles.filter(b => b.id !== bundle.id)];
        break;
      case BallotBundleState.BALLOT_BUNDLE_STATE_DELETED:
        this.deletedBundles = [bundle, ...this.deletedBundles.filter(b => b.id !== bundle.id)];
        break;
      default:
        this.openBundles = [bundle, ...this.openBundles.filter(b => b.id !== bundle.id)].sort((a, b) => this.sortOpenBundles(a, b));
        break;
    }
  }

  private sortOpenBundles(a: PoliticalBusinessResultBundle, b: PoliticalBusinessResultBundle): number {
    const diff = this.getOpenBundleOrderNumber(a.state) - this.getOpenBundleOrderNumber(b.state);
    if (diff !== 0) {
      return diff;
    }

    return a.number - b.number;
  }

  private getOpenBundleOrderNumber(state: BallotBundleState): number {
    if (state === BallotBundleState.BALLOT_BUNDLE_STATE_READY_FOR_REVIEW) {
      return 0;
    }

    if (state === BallotBundleState.BALLOT_BUNDLE_STATE_IN_CORRECTION) {
      return 1;
    }

    if (state === BallotBundleState.BALLOT_BUNDLE_STATE_IN_PROCESS) {
      return 2;
    }

    throw new Error('Bad bundle state parameter');
  }
}
