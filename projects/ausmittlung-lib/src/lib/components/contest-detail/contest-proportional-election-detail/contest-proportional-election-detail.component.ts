/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService, SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ContestCountingCircleDetails,
  ProportionalElectionResult,
  updateCountOfVotersCalculatedFields,
  ValidationOverview,
} from '../../../models';
import { PoliticalBusinessResultService } from '../../../services/political-business-result.service';
import { ProportionalElectionResultService } from '../../../services/proportional-election-result.service';
import { RoleService } from '../../../services/role.service';
import { SecondFactorTransactionService } from '../../../services/second-factor-transaction.service';
import { BallotCountInputComponent } from '../../ballot-count-input/ballot-count-input.component';
import { AbstractContestPoliticalBusinessDetailComponent } from '../contest-political-business-detail/contest-political-business-detail-base.component';
import { ContestPoliticalBusinessDetailComponent } from '../contest-political-business-detail/contest-political-business-detail.component';

@Component({
  selector: 'vo-ausm-contest-proportional-election-detail',
  templateUrl: './contest-proportional-election-detail.component.html',
  styleUrls: ['./contest-proportional-election-detail.component.scss'],
})
export class ContestProportionalElectionDetailComponent extends AbstractContestPoliticalBusinessDetailComponent<
  ProportionalElectionResult,
  ProportionalElectionResultService
> {
  // set has edits to true by default
  // since for proportional elections save and validate needs to be clicked before submit should be available
  // and validations should be ran in the frontend before submitting
  public hasEdits: boolean = true;

  public countOfVotersValid: boolean = true;

  @ViewChild(BallotCountInputComponent)
  private ballotCountInputComponent?: BallotCountInputComponent;

  constructor(
    parent: ContestPoliticalBusinessDetailComponent,
    i18n: TranslateService,
    toast: SnackbarService,
    roleService: RoleService,
    resultService: ProportionalElectionResultService,
    dialog: DialogService,
    secondFactorTransactionService: SecondFactorTransactionService,
    politicalBusinessResultService: PoliticalBusinessResultService,
    cd: ChangeDetectorRef,
    private readonly router: Router,
    private readonly themeService: ThemeService,
  ) {
    super(i18n, toast, resultService, dialog, secondFactorTransactionService, politicalBusinessResultService, cd, roleService, parent);
  }

  public resetResults(): void {
    if (!this.resultDetail) {
      return;
    }

    this.resultDetail.totalCountOfLists = 0;
    this.resultDetail.totalCountOfUnmodifiedLists = 0;
    this.resultDetail.totalCountOfBallots = 0;
    this.resultDetail.allBundlesReviewedOrDeleted = true;
  }

  public countingCircleDetailsUpdated(values: ContestCountingCircleDetails): void {
    super.countingCircleDetailsUpdated(values);

    if (!this.resultDetail) {
      return;
    }

    updateCountOfVotersCalculatedFields(this.resultDetail.countOfVoters, this.resultDetail.totalCountOfVoters);
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

      await this.resultService.enterCountOfVoters(this.resultDetail.id, this.resultDetail.countOfVoters);
      this.toast.success(this.i18n.instant('APP.SAVED'));
      this.hasEdits = false;
    } finally {
      this.isActionExecuting = false;
    }
  }

  public async openUnmodifiedLists(): Promise<void> {
    if (!this.resultDetail || (!this.isErfassungElectionAdmin && !this.isMonitoringElectionAdmin)) {
      return;
    }

    await this.router.navigate([this.themeService.theme$.value, 'proportional-election-result', this.resultDetail.id, 'unmodified']);
  }

  public async openModifiedLists(): Promise<void> {
    if (!this.resultDetail) {
      return;
    }

    await this.router.navigate([this.themeService.theme$.value, 'proportional-election-result', this.resultDetail.id, 'bundles']);
  }

  public async navigateToResults(): Promise<void> {
    if (!this.resultDetail) {
      return;
    }

    await this.router.navigate([this.themeService.theme$.value, 'proportional-election-result', this.resultDetail.id, 'results']);
  }

  public setFocus(): void {
    // detect changes to make sure that all components are visible
    this.cd.detectChanges();

    this.ballotCountInputComponent?.setFocus();
  }

  protected async loadValidationOverviewData(): Promise<ValidationOverview> {
    return this.resultService.validateEnterCountOfVoters(this.resultDetail!.id, this.resultDetail!.countOfVoters);
  }
}
