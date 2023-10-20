/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ContestCountingCircleDetails,
  MajorityElectionResult,
  MajorityElectionResultEntry,
  resetMajorityConventionalResults,
  updateCountOfVotersCalculatedFields,
  ValidationSummary,
} from '../../../models';
import { MajorityElectionResultService } from '../../../services/majority-election-result.service';
import { PoliticalBusinessResultService } from '../../../services/political-business-result.service';
import { RoleService } from '../../../services/role.service';
import { SecondFactorTransactionService } from '../../../services/second-factor-transaction.service';
import { AbstractContestPoliticalBusinessDetailComponent } from '../contest-political-business-detail/contest-political-business-detail-base.component';
import { ContestPoliticalBusinessDetailComponent } from '../contest-political-business-detail/contest-political-business-detail.component';
import { ContestMajorityElectionDetailDetailedComponent } from './contest-majority-election-detail-detailed/contest-majority-election-detail-detailed.component';
import { ContestMajorityElectionDetailFinalResultsComponent } from './contest-majority-election-detail-final-results/contest-majority-election-detail-final-results.component';

@Component({
  selector: 'vo-ausm-contest-majority-election-detail',
  templateUrl: './contest-majority-election-detail.component.html',
})
export class ContestMajorityElectionDetailComponent extends AbstractContestPoliticalBusinessDetailComponent<
  MajorityElectionResult,
  MajorityElectionResultService
> {
  public readonly entryVariants: typeof MajorityElectionResultEntry = MajorityElectionResultEntry;

  // set has edits to true by default
  // since for majority elections save and validate needs to be clicked before submit should be available
  // and validations should be ran in the frontend before submitting
  public hasEdits: boolean = true;

  public candidateResultsValid: boolean = true;
  public countOfVotersValid: boolean = true;

  @ViewChild(ContestMajorityElectionDetailDetailedComponent)
  private contestMajorityElectionDetailDetailedComponent?: ContestMajorityElectionDetailDetailedComponent;

  @ViewChild(ContestMajorityElectionDetailFinalResultsComponent)
  private contestMajorityElectionDetailFinalResultsComponent?: ContestMajorityElectionDetailFinalResultsComponent;

  constructor(
    parent: ContestPoliticalBusinessDetailComponent,
    i18n: TranslateService,
    toast: SnackbarService,
    roleService: RoleService,
    resultService: MajorityElectionResultService,
    dialog: DialogService,
    secondFactorTransactionService: SecondFactorTransactionService,
    politicalBusinessResultService: PoliticalBusinessResultService,
    cd: ChangeDetectorRef,
  ) {
    super(i18n, toast, resultService, dialog, secondFactorTransactionService, politicalBusinessResultService, cd, roleService, parent);
  }

  public updateCandidateResultsValid(): void {
    this.candidateResultsValid =
      !!this.resultDetail &&
      (this.resultDetail.conventionalSubTotal.individualVoteCount ?? 0) >= 0 &&
      this.resultDetail.candidateResults.every(x => (x.conventionalVoteCount ?? 0) >= 0) &&
      this.resultDetail.secondaryMajorityElectionResults.every(
        x => (x.conventionalSubTotal.individualVoteCount ?? 0) >= 0 && x.candidateResults.every(y => (y.conventionalVoteCount ?? 0) >= 0),
      );
  }

  public updateCountOfVotersValid(): void {
    this.countOfVotersValid = !!this.resultDetail && this.areCountOfVotersValid(this.resultDetail.countOfVoters);
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

      if (this.resultDetail.entry === MajorityElectionResultEntry.MAJORITY_ELECTION_RESULT_ENTRY_FINAL_RESULTS) {
        await this.resultService.enterCandidateResults(this.resultDetail);
      } else {
        await this.resultService.enterCountOfVoters(this.resultDetail.id, this.resultDetail.countOfVoters);
      }
      this.toast.success(this.i18n.instant('APP.SAVED'));
      this.hasEdits = false;
    } finally {
      this.isActionExecuting = false;
    }
  }

  public resetResults(): void {
    if (!this.resultDetail) {
      return;
    }

    resetMajorityConventionalResults(this.resultDetail);
  }

  public countingCircleDetailsUpdated(values: ContestCountingCircleDetails): void {
    super.countingCircleDetailsUpdated(values);

    if (!this.resultDetail) {
      return;
    }

    updateCountOfVotersCalculatedFields(this.resultDetail.countOfVoters, this.resultDetail.totalCountOfVoters);
  }

  public setFocus(): void {
    // detect changes to make sure that all components are visible
    this.cd.detectChanges();

    this.contestMajorityElectionDetailDetailedComponent?.setFocus();
    this.contestMajorityElectionDetailFinalResultsComponent?.setFocus();
  }

  protected async loadValidationSummary(): Promise<ValidationSummary> {
    return this.resultDetail!.entry === MajorityElectionResultEntry.MAJORITY_ELECTION_RESULT_ENTRY_FINAL_RESULTS
      ? await this.resultService.validateEnterCandidateResults(this.resultDetail!)
      : await this.resultService.validateEnterCountOfVoters(this.resultDetail!.id, this.resultDetail!.countOfVoters);
  }
}
