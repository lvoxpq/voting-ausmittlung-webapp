/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { ChangeDetectorRef, Input, OnDestroy, OnInit, Directive } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  ContestCountingCircleDetails,
  CountingCircleResult,
  CountingCircleResultState,
  PoliticalBusinessNullableCountOfVoters,
  ResultListResult,
  StateChange,
  SwissAbroadVotingRight,
  ValidationOverview,
  VoterType,
} from '../../../models';
import { PoliticalBusinessResultBaseService } from '../../../services/political-business-result-base.service';
import { PoliticalBusinessResultService } from '../../../services/political-business-result.service';
import { RoleService } from '../../../services/role.service';
import { SecondFactorTransactionService } from '../../../services/second-factor-transaction.service';
import { sum } from '../../../services/utils/array.utils';
import {
  ValidationOverviewDialogComponent,
  ValidationOverviewDialogData,
  ValidationOverviewDialogResult,
} from '../../validation-overview-dialog/validation-overview-dialog.component';
import { ContestPoliticalBusinessDetailComponent } from './contest-political-business-detail.component';

@Directive()
export abstract class AbstractContestPoliticalBusinessDetailComponent<
  T extends CountingCircleResult,
  TService extends PoliticalBusinessResultBaseService<T, any, any>,
> implements OnInit, OnDestroy
{
  @Input()
  public countingCircleId!: string;

  @Input()
  public result!: ResultListResult;

  @Input()
  public eVoting: boolean = false;

  @Input()
  public contestCountingCircleDetails!: ContestCountingCircleDetails;

  @Input()
  public contentReadonly: boolean = true;

  @Input()
  public contestLocked: boolean = true;

  @Input()
  public isResponsibleMonitorAuthority: boolean = false;

  public resultDetail?: T;
  public isErfassungElectionAdmin: boolean = false;
  public isMonitoringElectionAdmin: boolean = false;

  public readonly states: typeof CountingCircleResultState = CountingCircleResultState;

  public resultReadonly: boolean = true;
  public selectResultEntry: boolean = false;
  public isActionExecuting: boolean = false;
  public loading: boolean = true;
  public isDataLoaded: boolean = false;

  private readonly parentExpandedSubscription?: Subscription;
  private readonly parentCountingCircleDetailsUpdatedSubscription?: Subscription;
  private readonly stateChangeSubscription?: Subscription;
  private readonly isErfassungElectionAdminSubscription?: Subscription;
  private readonly isMonitoringElectionAdminSubscription?: Subscription;

  protected constructor(
    protected readonly i18n: TranslateService,
    protected readonly toast: SnackbarService,
    protected readonly resultService: TService,
    protected readonly dialog: DialogService,
    protected readonly secondFactorTransactionService: SecondFactorTransactionService,
    protected readonly politicalBusinessResultService: PoliticalBusinessResultService,
    protected readonly cd: ChangeDetectorRef,
    roleService: RoleService,
    parent: ContestPoliticalBusinessDetailComponent,
  ) {
    this.parentExpandedSubscription = parent.expanded$.pipe(filter(x => x)).subscribe(() => this.expanded());

    this.parentCountingCircleDetailsUpdatedSubscription = parent.countingCircleDetailsUpdated$.subscribe(details =>
      this.countingCircleDetailsUpdated(details),
    );

    this.stateChangeSubscription = this.politicalBusinessResultService.resultStateChanged$
      .pipe(filter(({ resultId }) => this.result.id === resultId))
      .subscribe(() => this.setResultReadonly());

    this.isErfassungElectionAdminSubscription = roleService.isErfassungElectionAdmin.subscribe(x => (this.isErfassungElectionAdmin = x));
    this.isMonitoringElectionAdminSubscription = roleService.isMonitoringElectionAdmin.subscribe(x => (this.isMonitoringElectionAdmin = x));
  }

  public ngOnInit(): void {
    this.setResultReadonly();
  }

  public ngOnDestroy(): void {
    this.parentExpandedSubscription?.unsubscribe();
    this.parentCountingCircleDetailsUpdatedSubscription?.unsubscribe();
    this.stateChangeSubscription?.unsubscribe();
    this.isErfassungElectionAdminSubscription?.unsubscribe();
    this.isMonitoringElectionAdminSubscription?.unsubscribe();
  }

  public countingCircleDetailsUpdated(values: ContestCountingCircleDetails): void {
    if (!this.resultDetail) {
      return;
    }

    if (
      this.resultDetail.politicalBusiness.swissAbroadVotingRight ===
      SwissAbroadVotingRight.SWISS_ABROAD_VOTING_RIGHT_ON_EVERY_COUNTING_CIRCLE
    ) {
      this.resultDetail.totalCountOfVoters = values.countOfVotersInformation.totalCountOfVoters;
      return;
    }

    this.resultDetail.totalCountOfVoters = sum(
      values.countOfVotersInformation.subTotalInfoList.filter(x => x.voterType === VoterType.VOTER_TYPE_SWISS),
      x => x.countOfVoters,
    );
  }

  public async stateUpdate(event: StateChange): Promise<void> {
    if (!this.resultDetail) {
      return;
    }

    try {
      this.isActionExecuting = true;

      if (
        (event.oldState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION &&
          event.newState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE) ||
        (event.oldState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING &&
          event.newState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE)
      ) {
        const validationConfirm = await this.confirmValidationOverviewDialog(true);
        if (!validationConfirm) {
          return;
        }
      }

      await this.executeStateUpdate(this.resultDetail, event);
      this.toast.success(this.i18n.instant('APP.SAVED'));
      this.result.state = this.resultDetail.state = event.newState;
      this.politicalBusinessResultService.resultStateChanged(this.resultDetail.id, event.newState, event.comment);
    } finally {
      this.isActionExecuting = false;
    }
  }

  protected abstract loadValidationOverviewData(): Promise<ValidationOverview>;

  protected async confirmValidationOverviewDialog(isFinishingOperation: boolean): Promise<boolean> {
    const validationOverview = await this.loadValidationOverviewData();

    const data: ValidationOverviewDialogData = {
      validationOverview,
      canEmitSave: !(isFinishingOperation && !validationOverview.isValid),
      header: `VALIDATION.COUNTING_CIRCLE_RESULT.HEADER.${isFinishingOperation ? 'FINISHING_OPERATION' : 'SAVE_OPERATION'}.${
        validationOverview.isValid ? 'VALID' : 'INVALID'
      }`,
      saveLabel: isFinishingOperation && !validationOverview.isValid ? 'APP.CONTINUE' : 'COMMON.SAVE',
      validationResultsLabel: validationOverview.isValid ? undefined : 'VALIDATION.COUNTING_CIRCLE_RESULT.DESCRIPTION.INVALID',
    };

    const result = await this.dialog.openForResult<ValidationOverviewDialogComponent, ValidationOverviewDialogResult>(
      ValidationOverviewDialogComponent,
      data,
    );

    return !!result && result.save;
  }

  protected async executeStateUpdate({ id }: T, { oldState, newState, comment }: StateChange): Promise<void> {
    switch (newState) {
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE: {
        if (oldState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_AUDITED_TENTATIVELY) {
          await this.resultService.resetToSubmissionFinished(id);
          break;
        }

        const secondFactorTransaction = await this.resultService.prepareSubmissionFinished(id);
        await this.secondFactorTransactionService.showDialogAndExecuteVerifyAction(
          () => this.resultService.submissionFinished(id, secondFactorTransaction.getId()),
          secondFactorTransaction.getCode(),
        );

        break;
      }
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION: {
        await this.resultService.flagForCorrection(id, comment);
        break;
      }
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE: {
        const secondFactorTransaction = await this.resultService.prepareCorrectionFinished(id);
        await this.secondFactorTransactionService.showDialogAndExecuteVerifyAction(
          () => this.resultService.correctionFinished(id, comment, secondFactorTransaction.getId()),
          secondFactorTransaction.getCode(),
        );
        break;
      }
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_AUDITED_TENTATIVELY: {
        if (oldState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_PLAUSIBILISED) {
          await this.resultService.resetToAuditedTentatively([id]);
          break;
        }
        await this.resultService.auditedTentatively([id]);
        break;
      }
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_PLAUSIBILISED: {
        await this.resultService.plausibilise([id]);
        break;
      }
    }
  }

  protected loadData(): Promise<T> {
    return this.resultService.get(this.result.politicalBusiness.id, this.countingCircleId);
  }

  protected areCountOfVotersValid(countOfVoters: PoliticalBusinessNullableCountOfVoters): boolean {
    return (
      (countOfVoters.conventionalReceivedBallots ?? 0) >= 0 &&
      (countOfVoters.conventionalAccountedBallots ?? 0) >= 0 &&
      (countOfVoters.conventionalInvalidBallots ?? 0) >= 0 &&
      (countOfVoters.conventionalBlankBallots ?? 0) >= 0
    );
  }

  protected abstract setFocus(): void;

  private async expanded(): Promise<void> {
    if (!this.isDataLoaded) {
      try {
        this.loading = true;
        this.resultDetail = await this.loadData();
      } finally {
        this.loading = false;
        this.isDataLoaded = true;
      }
    }

    this.setFocus();
  }

  private setResultReadonly(): void {
    this.resultReadonly =
      this.contestLocked ||
      this.contentReadonly ||
      (this.result.state !== this.states.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING &&
        this.result.state !== this.states.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION);
  }
}
