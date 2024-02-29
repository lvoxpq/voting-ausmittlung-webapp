/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { CountingCircleResultState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';
import { DialogService, SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProportionalElectionUnmodifiedListResults } from '../../../models';
import { ProportionalElectionResultService } from '../../../services/proportional-election-result.service';
import { PermissionService } from '../../../services/permission.service';
import { sum } from '../../../services/utils/array.utils';
import { NumberComponent } from '@abraxas/base-components';
import { Permissions } from '../../../models/permissions.model';

@Component({
  selector: 'vo-ausm-proportional-election-unmodified-lists',
  templateUrl: './proportional-election-unmodified-lists.component.html',
  styleUrls: ['./proportional-election-unmodified-lists.component.scss'],
})
export class ProportionalElectionUnmodifiedListsComponent implements OnInit, OnDestroy {
  @ViewChildren(NumberComponent)
  public listResultComponents?: QueryList<NumberComponent>;

  public result?: ProportionalElectionUnmodifiedListResults;
  public total: number = 0;
  public loading: boolean = true;
  public saving: boolean = false;
  public canEdit: boolean = false;
  public canSave: boolean = false;
  public hasChanges: boolean = false;
  public resultReadOnly: boolean = false;
  public newZhFeaturesEnabled: boolean = false;

  private readonly routeParamsSubscription: Subscription;
  private readonly routeDataSubscription: Subscription;

  constructor(
    private readonly i18n: TranslateService,
    private readonly toast: SnackbarService,
    private readonly dialog: DialogService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly resultService: ProportionalElectionResultService,
    private readonly themeService: ThemeService,
    private readonly permissionService: PermissionService,
  ) {
    this.routeParamsSubscription = route.params.subscribe(({ resultId }) => this.loadData(resultId));
    this.routeDataSubscription = route.data.subscribe(async ({ contestCantonDefaults }) => {
      this.newZhFeaturesEnabled = contestCantonDefaults.newZhFeaturesEnabled;
    });
  }

  public async ngOnInit(): Promise<void> {
    this.canEdit = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResult.EnterResults);
  }

  public async back(): Promise<void> {
    if (!this.hasChanges) {
      await this.navigateToContestDetail();
      return;
    }

    if (
      await this.dialog.confirm(this.i18n.instant('APP.CHANGES.TITLE'), this.i18n.instant('APP.CHANGES.MSG'), this.i18n.instant('APP.NEXT'))
    ) {
      await this.navigateToContestDetail();
    }
  }

  public async save(): Promise<void> {
    if (!this.result) {
      return;
    }

    this.saving = true;
    try {
      await this.resultService.enterUnmodifiedListResults(this.result.electionResult.id, this.result.unmodifiedListResults);
      this.toast.success(this.i18n.instant('APP.SAVED'));
      this.hasChanges = false;
      await this.navigateToContestDetail();
    } finally {
      this.saving = false;
    }
  }

  public updateTotalAndSetChanges(): void {
    if (!this.result) {
      return;
    }
    this.total = sum(this.result.unmodifiedListResults, r => r.conventionalVoteCount);
    this.canSave = this.result?.unmodifiedListResults.every(x => x.conventionalVoteCount >= 0) ?? false;
    this.hasChanges = true;
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.routeDataSubscription.unsubscribe();
  }

  private async loadData(resultId: string): Promise<void> {
    this.loading = true;
    try {
      this.result = await this.resultService.getUnmodifiedLists(resultId);
      this.resultReadOnly =
        this.result.electionResult.election.contest!.locked ||
        (this.result.electionResult.state !== CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION &&
          this.result.electionResult.state !== CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING);
      this.updateTotalAndSetChanges();
      this.hasChanges = false;
    } finally {
      this.loading = false;

      // setTimeout is needed to make sure all components are visible
      setTimeout(() => this.listResultComponents?.first.setFocus());
    }
  }

  private async navigateToContestDetail(): Promise<void> {
    if (!this.result) {
      return;
    }

    await this.router.navigate(
      [
        this.themeService.theme$.value,
        'contests',
        this.result.electionResult.election.contestId,
        this.result.electionResult.countingCircleId,
      ],
      {
        queryParams: {
          politicalBusinessId: this.result.electionResult.election.id,
        },
      },
    );
  }
}
