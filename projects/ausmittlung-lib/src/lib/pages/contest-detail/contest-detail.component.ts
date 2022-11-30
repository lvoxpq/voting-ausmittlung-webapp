/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { AuthorizationService, Tenant } from '@abraxas/base-components';
import { DialogService } from '@abraxas/voting-lib';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContestDetailSidebarComponent } from '../../components/contest-detail/contest-detail-sidebar/contest-detail-sidebar.component';
import { ContestPoliticalBusinessDetailComponent } from '../../components/contest-detail/contest-political-business-detail/contest-political-business-detail.component';
import {
  CountingCircleResultExportDialogComponent,
  CountingCircleResultExportDialogData,
} from '../../components/counting-circle-result-export-dialog/counting-circle-result-export-dialog.component';
import {
  MajorityElectionWriteInMappingDialogComponent,
  ResultImportWriteInMappingDialogData,
  // eslint-disable-next-line max-len
} from '../../components/majority-election-write-in-mappings/majority-election-write-in-mapping-dialog/majority-election-write-in-mapping-dialog.component';
import { ContestCountingCircleDetails, CountingCircleResultState, ResultList, ResultListResult } from '../../models';
import { BreadcrumbItem, BreadcrumbsService } from '../../services/breadcrumbs.service';
import { PoliticalBusinessResultService } from '../../services/political-business-result.service';
import { ResultService } from '../../services/result.service';
import { RoleService } from '../../services/role.service';
import { groupBySingle } from '../../services/utils/array.utils';

@Component({
  selector: 'vo-ausm-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.scss'],
})
export class ContestDetailComponent implements AfterViewInit, OnDestroy {
  public resultList?: ResultList;
  public loading: boolean = true;

  @Input()
  public contentReadonly: boolean = true;

  @Input()
  public showSetAllAuditedTentatively: boolean = false;

  @Input()
  public showResetResultsInTestingPhase: boolean = false;

  public sidebarReadonly: boolean = true;

  public tenant?: Tenant;

  @ViewChildren(ContestPoliticalBusinessDetailComponent)
  public politicalBusinessesDetails?: QueryList<ContestPoliticalBusinessDetailComponent>;

  public isErfassungElectionAdmin: boolean = false;

  public readonly breadcrumbs: BreadcrumbItem[];

  private readonly isErfassungElectionAdminSubscription: Subscription;
  private readonly routeParamsSubscription: Subscription;
  private readonly routeQueryParamsSubscription: Subscription;
  private politicalBusinessesDetailsChangeSubscription?: Subscription;
  private stateChangesSubscription?: Subscription;

  @ViewChild(ContestDetailSidebarComponent)
  private contestDetailSidebarComponent?: ContestDetailSidebarComponent;

  private politicalBusinessIdToExpand?: string;
  private resultsById: Record<string, ResultListResult> = {};

  constructor(
    roleService: RoleService,
    breadcrumbsService: BreadcrumbsService,
    private readonly route: ActivatedRoute,
    private readonly resultService: ResultService,
    private readonly auth: AuthorizationService,
    private readonly cd: ChangeDetectorRef,
    private readonly dialogService: DialogService,
    private readonly politicalBusinessResultService: PoliticalBusinessResultService,
  ) {
    this.breadcrumbs = breadcrumbsService.contestDetail;
    this.isErfassungElectionAdminSubscription = roleService.isErfassungElectionAdmin.subscribe(x => {
      const wasAdmin = this.isErfassungElectionAdmin;
      this.isErfassungElectionAdmin = x;
      if (!wasAdmin && this.isErfassungElectionAdmin) {
        this.mapWriteIns();
      }
    });
    this.routeQueryParamsSubscription = this.route.queryParams.subscribe(({ politicalBusinessId }) =>
      this.tryExpandPoliticalBusinesses(politicalBusinessId),
    );
    this.routeParamsSubscription = this.route.params.subscribe(({ contestId, countingCircleId }) =>
      this.loadData(contestId, countingCircleId),
    );
  }

  public async mapWriteIns(): Promise<void> {
    if (
      this.contentReadonly ||
      !this.resultList ||
      !this.resultList.currentTenantIsResponsible ||
      this.resultList.contest.locked ||
      !this.resultList.contest.eVotingResultsImported ||
      !this.resultList.hasUnmappedEVotingWriteIns ||
      !this.isErfassungElectionAdmin
    ) {
      return;
    }

    const data: ResultImportWriteInMappingDialogData = {
      contestId: this.resultList.contest.id,
      countingCircleId: this.resultList.countingCircle.id,
    };

    const mapped = await this.dialogService.openForResult(MajorityElectionWriteInMappingDialogComponent, data);
    if (mapped) {
      this.resultList.hasUnmappedEVotingWriteIns = false;
    }
  }

  public export(): void {
    if (!this.resultList) {
      return;
    }

    const data: CountingCircleResultExportDialogData = {
      countingCircleResults: this.resultList.results,
      contestId: this.resultList.contest.id,
      countingCircleId: this.resultList.countingCircle.id,
    };

    this.dialogService.open(CountingCircleResultExportDialogComponent, data);
  }

  public ngAfterViewInit(): void {
    this.politicalBusinessesDetails?.notifyOnChanges();
    this.politicalBusinessesDetailsChangeSubscription = this.politicalBusinessesDetails?.changes.subscribe(() =>
      this.tryExpandPoliticalBusinesses(),
    );
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
    this.routeQueryParamsSubscription?.unsubscribe();
    this.politicalBusinessesDetailsChangeSubscription?.unsubscribe();
    this.isErfassungElectionAdminSubscription?.unsubscribe();
    this.stateChangesSubscription?.unsubscribe();
  }

  public updateCountOfVoters(newData: ContestCountingCircleDetails): void {
    const initialResultList = this.resultList?.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_INITIAL;
    this.politicalBusinessesDetails?.forEach(pb => {
      if (!initialResultList) {
        pb.countingCircleDetailsUpdated(newData);
      } else {
        pb.expanded = false;
        pb.result.state = CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING;
      }
    });

    if (initialResultList) {
      this.resultList!.state = CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING;
    }
  }

  private stateUpdated(resultId: string, newState: CountingCircleResultState, comment?: string): void {
    if (!this.resultList) {
      return;
    }

    const result = this.resultsById[resultId] || {};
    if (!result) {
      return;
    }

    result.state = newState;
    if (result.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE) {
      result.submissionDoneTimestamp = new Date();
    }
    result.hasComments = result.hasComments || !!comment;

    this.resultList.state = Math.min(...this.resultList.results.map(r => r.state));
    this.updateSidebarReadonly();
    this.politicalBusinessResultService.resultStateChanged(result.id, newState);
  }

  private async loadData(contestId: string, countingCircleId: string): Promise<void> {
    this.loading = true;
    try {
      this.resultList = await this.resultService.getList(contestId, countingCircleId);
      this.updateSidebarReadonly();
      this.tenant = await this.auth.getActiveTenant();
      this.tryExpandPoliticalBusinesses();
      this.mapWriteIns();
      this.resultsById = groupBySingle(
        this.resultList.results,
        x => x.id,
        x => x,
      );
      this.startChangesListener();

      // detect changes to make sure that all components are visible
      this.cd.detectChanges();
      this.contestDetailSidebarComponent?.setFocus();
    } finally {
      this.loading = false;
    }
  }

  private tryExpandPoliticalBusinesses(newId?: string): void {
    if (newId) {
      this.politicalBusinessIdToExpand = newId;
    } else if (!this.politicalBusinessIdToExpand) {
      return;
    }

    const expandable = this.politicalBusinessesDetails?.find(x => x.result.politicalBusiness.id === this.politicalBusinessIdToExpand);
    if (expandable) {
      expandable.expanded = true;
      delete this.politicalBusinessIdToExpand;
      this.cd.detectChanges();
    }
  }

  private updateSidebarReadonly(): void {
    if (!this.resultList || this.resultList.contest.locked) {
      this.sidebarReadonly = true;
      return;
    }

    const maxResultListState = Math.max(
      ...this.resultList.results.map(l => l.state),
      CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_INITIAL,
    );
    this.sidebarReadonly = maxResultListState >= CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE;
  }

  private startChangesListener(): void {
    if (!this.resultList || !this.resultList.contest) {
      return;
    }

    this.stateChangesSubscription?.unsubscribe();
    this.stateChangesSubscription = this.resultService
      .getStateChanges(this.resultList.contest.id)
      .subscribe(({ id, newState }) => this.stateUpdated(id, newState));
  }
}
