/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, HostListener, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CountOfVotersInformation, DomainOfInfluenceType, VotingCardChannel, VotingCardResultDetail } from '../../../models';
import { CountingMachine } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/counting_machine_pb';
import { DialogService, EnumItemDescription, EnumUtil } from '@abraxas/voting-lib';
import {
  ValidationOverviewDialogComponent,
  ValidationOverviewDialogData,
  ValidationOverviewDialogResult,
} from '../../validation-overview-dialog/validation-overview-dialog.component';
import { ContestCountingCircleDetailsService } from '../../../services/contest-counting-circle-details.service';
import { ContestCountingCircleElectorateSummary } from '../../../models/contest-counting-circle-electorate.model';
import { DomainOfInfluenceCanton } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/domain_of_influence_pb';
import { cloneDeep, isEqual } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'vo-ausm-contest-detail-info-dialog',
  templateUrl: './contest-detail-info-dialog.component.html',
  styleUrls: ['./contest-detail-info-dialog.component.scss'],
})
export class ContestDetailInfoDialogComponent implements OnDestroy {
  public readonly countingMachines: EnumItemDescription<CountingMachine>[] = [];

  @HostListener('window:beforeunload')
  public beforeUnload(): boolean {
    return !this.hasChanges;
  }

  @HostListener('window:keyup.esc')
  public async keyUpEscape(): Promise<void> {
    await this.closeWithUnsavedChangesCheck();
  }

  public readonly: boolean;
  public domainOfInfluenceTypes: DomainOfInfluenceType[];
  public countingMachineEnabled: boolean;
  public newZhFeaturesEnabled: boolean;
  public eVoting: boolean;
  public swissAbroadHaveVotingRightsOnAnyBusiness: boolean;
  public countOfVoters: CountOfVotersInformation;
  public votingCards: VotingCardResultDetail[];
  public enabledVotingCardChannels: VotingCardChannel[];
  public countingMachine: CountingMachine;
  public canton: DomainOfInfluenceCanton;
  public contestId?: string;
  public countingCircleId?: string;
  public electorateSummary?: ContestCountingCircleElectorateSummary;

  public hasChanges: boolean = false;
  public originalVotingCards: VotingCardResultDetail[];
  public originalCountOfVoters: CountOfVotersInformation;
  public originalCountingMachine: CountingMachine;

  public readonly backdropClickSubscription: Subscription;

  constructor(
    private readonly dialogRef: MatDialogRef<ContestDetailInfoDialogData, ContestDetailInfoDialogResult>,
    private readonly contestCountingCircleDetailsService: ContestCountingCircleDetailsService,
    private readonly dialogService: DialogService,
    private readonly i18n: TranslateService,
    @Inject(MAT_DIALOG_DATA) dialogData: ContestDetailInfoDialogData,
    enumUtil: EnumUtil,
  ) {
    this.readonly = dialogData.readonly;
    this.domainOfInfluenceTypes = dialogData.domainOfInfluenceTypes;
    this.countingMachineEnabled = dialogData.countingMachineEnabled;
    this.newZhFeaturesEnabled = dialogData.newZhFeaturesEnabled;
    this.eVoting = dialogData.eVoting;
    this.swissAbroadHaveVotingRightsOnAnyBusiness = dialogData.swissAbroadHaveVotingRightsOnAnyBusiness;
    this.countOfVoters = cloneDeep(dialogData.countOfVoters);
    this.votingCards = dialogData.votingCards;
    this.enabledVotingCardChannels = dialogData.enabledVotingCardChannels;
    this.countingMachine = dialogData.countingMachine;
    this.canton = dialogData.canton;
    this.contestId = dialogData.contestId;
    this.countingCircleId = dialogData.countingCircleId;
    this.electorateSummary = dialogData.electorateSummary;
    this.countingMachines = enumUtil.getArrayWithDescriptions<CountingMachine>(CountingMachine, 'COUNTING_MACHINES.');

    this.originalVotingCards = cloneDeep(this.votingCards);
    this.originalCountOfVoters = cloneDeep(this.countOfVoters);
    this.originalCountingMachine = cloneDeep(this.countingMachine);

    this.dialogRef.disableClose = true;
    this.backdropClickSubscription = this.dialogRef.backdropClick().subscribe(async () => this.closeWithUnsavedChangesCheck());
  }

  public ngOnDestroy(): void {
    this.backdropClickSubscription.unsubscribe();
  }

  public async closeWithUnsavedChangesCheck(): Promise<void> {
    if (await this.leaveDialogOpen()) {
      return;
    }

    this.dialogRef.close();
  }

  public async save(): Promise<void> {
    const validationConfirm = await this.confirmValidationOverviewDialog();
    if (!validationConfirm) {
      return;
    }

    this.hasChanges = false;
    this.dialogRef.close({
      countOfVoters: this.countOfVoters,
      votingCards: this.votingCards,
      countingMachine: this.countingMachine,
    });
  }

  public contentChanged(): void {
    this.hasChanges =
      !isEqual(this.votingCards, this.originalVotingCards) ||
      !isEqual(this.countOfVoters, this.originalCountOfVoters) ||
      !isEqual(this.countingMachine, this.originalCountingMachine);
  }

  private async leaveDialogOpen(): Promise<boolean> {
    return this.hasChanges && !(await this.dialogService.confirm('APP.CHANGES.TITLE', this.i18n.instant('APP.CHANGES.MSG'), 'APP.YES'));
  }

  private async confirmValidationOverviewDialog(): Promise<boolean> {
    if (!this.contestId || !this.countingCircleId) {
      return false;
    }

    const validationSummary = await this.contestCountingCircleDetailsService.validateUpdateDetails({
      contestId: this.contestId,
      countingCircleId: this.countingCircleId,
      countingMachine: this.countingMachine ?? CountingMachine.COUNTING_MACHINE_UNSPECIFIED,
      countOfVotersInformation: this.countOfVoters,
      votingCards: this.votingCards,
      eVoting: this.eVoting,
    });

    const data: ValidationOverviewDialogData = {
      validationSummaries: [validationSummary],
      canEmitSave: validationSummary.isValid,
      header: `VALIDATION.${validationSummary.isValid ? 'VALID' : 'INVALID'}`,
      saveLabel: !validationSummary.isValid ? 'APP.CONTINUE' : 'COMMON.SAVE',
    };

    const result = await this.dialogService.openForResult<ValidationOverviewDialogComponent, ValidationOverviewDialogResult>(
      ValidationOverviewDialogComponent,
      data,
    );

    return !!result && result.save;
  }
}

export interface ContestDetailInfoDialogData {
  readonly: boolean;
  domainOfInfluenceTypes: DomainOfInfluenceType[];
  countingMachineEnabled: boolean;
  newZhFeaturesEnabled: boolean;
  eVoting: boolean;
  swissAbroadHaveVotingRightsOnAnyBusiness: boolean;
  countOfVoters: CountOfVotersInformation;
  votingCards: VotingCardResultDetail[];
  enabledVotingCardChannels: VotingCardChannel[];
  countingMachine: CountingMachine;
  canton: DomainOfInfluenceCanton;
  contestId?: string;
  countingCircleId?: string;
  electorateSummary?: ContestCountingCircleElectorateSummary;
}

export interface ContestDetailInfoDialogResult {
  countOfVoters: CountOfVotersInformation;
  votingCards: VotingCardResultDetail[];
  countingMachine: CountingMachine;
}
