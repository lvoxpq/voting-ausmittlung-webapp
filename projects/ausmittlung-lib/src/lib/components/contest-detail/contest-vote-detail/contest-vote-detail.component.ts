/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { CountingCircleResultState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';
import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, isEqual } from 'lodash';
import {
  BallotQuestionResult,
  ContestCountingCircleDetails,
  StateChange,
  TieBreakQuestionResult,
  updateCountOfVotersCalculatedFields,
  ValidationOverview,
  VoteResult,
  VoteResultEntry,
} from '../../../models';
import { PoliticalBusinessResultService } from '../../../services/political-business-result.service';
import { RoleService } from '../../../services/role.service';
import { SecondFactorTransactionService } from '../../../services/second-factor-transaction.service';
import { VoteResultService } from '../../../services/vote-result.service';
import { AbstractContestPoliticalBusinessDetailComponent } from '../contest-political-business-detail/contest-political-business-detail-base.component';
import { ContestPoliticalBusinessDetailComponent } from '../contest-political-business-detail/contest-political-business-detail.component';
import { ContestVoteDetailBallotComponent } from './contest-vote-detail-ballot/contest-vote-detail-ballot.component';
import { ContestVoteDetailDetailedComponent } from './contest-vote-detail-detailed/contest-vote-detail-detailed.component';

@Component({
  selector: 'vo-ausm-contest-vote-detail',
  templateUrl: './contest-vote-detail.component.html',
})
export class ContestVoteDetailComponent extends AbstractContestPoliticalBusinessDetailComponent<VoteResult, VoteResultService> {
  public readonly entryVariants: typeof VoteResultEntry = VoteResultEntry;

  public lastSavedVoteResult?: VoteResult;
  public countOfVotersValid: boolean = true;

  @ViewChild(ContestVoteDetailBallotComponent)
  private contestVoteDetailBallotComponent?: ContestVoteDetailBallotComponent;

  @ViewChild(ContestVoteDetailDetailedComponent)
  private contestVoteDetailDetailedComponent?: ContestVoteDetailDetailedComponent;

  constructor(
    parent: ContestPoliticalBusinessDetailComponent,
    i18n: TranslateService,
    toast: SnackbarService,
    roleService: RoleService,
    voteResultService: VoteResultService,
    dialog: DialogService,
    secondFactorTransactionService: SecondFactorTransactionService,
    politicalBusinessResultService: PoliticalBusinessResultService,
    cd: ChangeDetectorRef,
  ) {
    super(i18n, toast, voteResultService, dialog, secondFactorTransactionService, politicalBusinessResultService, cd, roleService, parent);
  }

  public get hasUnsavedChanges(): boolean {
    return !isEqual(this.resultDetail, this.lastSavedVoteResult);
  }

  public async validateAndSave(): Promise<void> {
    if (!this.resultDetail) {
      return;
    }

    try {
      this.isActionExecuting = true;

      const validationConfirm = await this.confirmValidationOverviewDialog(false);
      if (!validationConfirm) {
        return;
      }

      if (this.resultDetail.entry === VoteResultEntry.VOTE_RESULT_ENTRY_FINAL_RESULTS) {
        if (this.resultDetail.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION) {
          await this.resultService.enterCorrectionResults(this.resultDetail);
        } else {
          await this.resultService.enterResults(this.resultDetail);
        }
      } else {
        await this.resultService.enterCountOfVoters(this.resultDetail);
      }
      this.lastSavedVoteResult = cloneDeep(this.resultDetail);
      this.toast.success(this.i18n.instant('APP.SAVED'));
    } finally {
      this.isActionExecuting = false;
    }
  }

  public resetResults(): void {
    if (!this.resultDetail) {
      return;
    }

    const isDetailedEntry = this.resultDetail.entry === VoteResultEntry.VOTE_RESULT_ENTRY_DETAILED;

    for (const ballotResult of this.resultDetail.results) {
      ballotResult.conventionalCountOfDetailedEnteredBallots = 0;
      ballotResult.allBundlesReviewedOrDeleted = true;

      this.resetQuestionResults(ballotResult.questionResults, isDetailedEntry);
      this.resetQuestionResults(ballotResult.tieBreakQuestionResults, isDetailedEntry);
    }
  }

  public countingCircleDetailsUpdated(values: ContestCountingCircleDetails): void {
    super.countingCircleDetailsUpdated(values);

    if (!this.resultDetail) {
      return;
    }

    for (const ballotResult of this.resultDetail.results) {
      updateCountOfVotersCalculatedFields(ballotResult.countOfVoters, this.resultDetail.totalCountOfVoters);
    }
  }

  public updateCountOfVotersValid(): void {
    this.countOfVotersValid = !!this.resultDetail && this.resultDetail.results.every(r => this.areCountOfVotersValid(r.countOfVoters));
  }

  public setFocus(): void {
    // detect changes to make sure that all components are visible
    this.cd.detectChanges();

    this.contestVoteDetailBallotComponent?.setFocus();
    this.contestVoteDetailDetailedComponent?.setFocus();
  }

  protected async loadValidationOverviewData(): Promise<ValidationOverview> {
    if (this.resultDetail!.entry === VoteResultEntry.VOTE_RESULT_ENTRY_FINAL_RESULTS) {
      if (this.resultDetail!.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION) {
        return await this.resultService.validateEnterCorrectionResults(this.resultDetail!);
      } else {
        return await this.resultService.validateEnterResults(this.resultDetail!);
      }
    } else {
      return await this.resultService.validateEnterCountOfVoters(this.resultDetail!);
    }
  }

  protected async executeStateUpdate(result: VoteResult, stateChange: StateChange): Promise<void> {
    await super.executeStateUpdate(result, stateChange);
    this.lastSavedVoteResult!.state = stateChange.newState;
  }

  protected async loadData(): Promise<VoteResult> {
    const detailedResult = await super.loadData();
    this.lastSavedVoteResult = cloneDeep(detailedResult);
    return detailedResult;
  }

  private resetQuestionResults(questionResults: BallotQuestionResult[] | TieBreakQuestionResult[], isDetailedEntry: boolean): void {
    const conventionalDefaultValue = isDetailedEntry ? 0 : undefined;

    for (const questionResult of questionResults) {
      questionResult.conventionalSubTotal.totalCountOfAnswer1 = conventionalDefaultValue;
      questionResult.conventionalSubTotal.totalCountOfAnswer2 = conventionalDefaultValue;
      questionResult.conventionalSubTotal.totalCountOfAnswerUnspecified = conventionalDefaultValue;

      questionResult.totalCountOfAnswer1 = questionResult.eVotingSubTotal.totalCountOfAnswer1;
      questionResult.totalCountOfAnswer2 = questionResult.eVotingSubTotal.totalCountOfAnswer2;
      questionResult.totalCountOfAnswerUnspecified = questionResult.eVotingSubTotal.totalCountOfAnswerUnspecified;
    }
  }
}
