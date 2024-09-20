/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DialogService, EnumItemDescription, EnumUtil, SnackbarService } from '@abraxas/voting-lib';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContestCountingCircleDetails, CountingMachine, DomainOfInfluenceType, ResultList, VotingChannel } from '../../../models';
import { ContestCountingCircleDetailsService } from '../../../services/contest-counting-circle-details.service';
import { PermissionService } from '../../../services/permission.service';
import { distinct, flatten } from '../../../services/utils/array.utils';
import {
  ValidationOverviewDialogComponent,
  ValidationOverviewDialogData,
  ValidationOverviewDialogResult,
} from '../../validation-overview-dialog/validation-overview-dialog.component';
import { ContestDetailCountOfVotersComponent } from '../contest-detail-count-of-voters/contest-detail-count-of-voters.component';
import {
  ContactPersonEditDialogComponent,
  ContactPersonEditDialogData,
  ContactPersonEditDialogResult,
} from './contact-person-edit-dialog/contact-person-edit-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Permissions } from '../../../models/permissions.model';
import { DomainOfInfluenceCanton } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/domain_of_influence_pb';
import {
  ContestCountingCircleElectoratesUpdateDialogComponent,
  ContestCountingCircleElectoratesUpdateDialogData,
  ContestCountingCircleElectoratesUpdateDialogResult,
} from '../../contest-counting-circle-electorates-update-dialog/contest-counting-circle-electorates-update-dialog.component';

// TODO: can be removed if new UI is standard
@Component({
  selector: 'vo-ausm-contest-detail-sidebar',
  templateUrl: './contest-detail-sidebar.component.html',
  styleUrls: ['./contest-detail-sidebar.component.scss'],
})
export class ContestDetailSidebarComponent implements OnInit, OnDestroy {
  public readonly countingMachines: EnumItemDescription<CountingMachine>[] = [];

  @Input()
  public readonly: boolean = true;

  @Input()
  public canton: DomainOfInfluenceCanton = DomainOfInfluenceCanton.DOMAIN_OF_INFLUENCE_CANTON_UNSPECIFIED;

  @Output()
  public saved: EventEmitter<ContestCountingCircleDetails> = new EventEmitter<ContestCountingCircleDetails>();

  public saving: boolean = false;
  public canEditContactPerson: boolean = false;
  public canEditCountingCircleDetails: boolean = false;
  public canEditElectorates: boolean = false;

  public resultListValue?: ResultList;
  public domainOfInfluenceTypes: DomainOfInfluenceType[] = [];
  public countingMachineEnabled: boolean = false;
  public routeSubscription: Subscription;

  @ViewChild(ContestDetailCountOfVotersComponent)
  private contestDetailCountOfVotersComponent?: ContestDetailCountOfVotersComponent;

  constructor(
    private readonly contestCountingCircleDetailsService: ContestCountingCircleDetailsService,
    private readonly toast: SnackbarService,
    private readonly i18n: TranslateService,
    private readonly dialogService: DialogService,
    private readonly permissionService: PermissionService,
    enumUtil: EnumUtil,
    route: ActivatedRoute,
  ) {
    this.countingMachines = enumUtil.getArrayWithDescriptions<CountingMachine>(CountingMachine, 'COUNTING_MACHINES.');

    this.routeSubscription = route.data.subscribe(async ({ contestCantonDefaults }) => {
      this.countingMachineEnabled = contestCantonDefaults.countingMachineEnabled;
    });
  }

  public async ngOnInit(): Promise<void> {
    this.canEditContactPerson = await this.permissionService.hasPermission(Permissions.CountingCircleContactPerson.Update);
    this.canEditCountingCircleDetails = await this.permissionService.hasPermission(Permissions.ContestCountingCircleDetails.Update);
    this.canEditElectorates = await this.permissionService.hasPermission(Permissions.ContestCountingCircleElectorate.Update);
  }

  @Input()
  public set resultList(value: ResultList | undefined) {
    this.resultListValue = value;

    if (value) {
      this.domainOfInfluenceTypes = distinct(
        value.results.map(r => r.politicalBusiness.domainOfInfluence!.type),
        x => x,
      );
    }

    if (value?.mustUpdateContactPersons) {
      this.openContactPersonEdit(false);
    }
  }

  public async save(): Promise<void> {
    if (!this.resultListValue) {
      return;
    }

    try {
      this.saving = true;

      const validationConfirm = await this.confirmValidationOverviewDialog();
      if (!validationConfirm) {
        return;
      }

      if (!this.countingMachineEnabled) {
        this.resultListValue.details.countingMachine = CountingMachine.COUNTING_MACHINE_UNSPECIFIED;
      }

      await this.contestCountingCircleDetailsService.updateDetails(this.resultListValue.details);
      this.toast.success(this.i18n.instant('CONTEST.DETAIL.COUNTING_CIRCLE_DETAILS_SAVED'));
      this.saved.emit(this.resultListValue.details);
    } finally {
      this.saving = false;
    }
  }

  public async openContactPersonEdit(showCancel: boolean = true): Promise<void> {
    if (!this.resultListValue || this.resultListValue.contest.locked) {
      return;
    }

    const dialogData: ContactPersonEditDialogData = {
      resultList: this.resultListValue,
      showCancel,
    };
    const dialogResult = await this.dialogService.openForResult<ContactPersonEditDialogComponent, ContactPersonEditDialogResult>(
      ContactPersonEditDialogComponent,
      dialogData,
      { disableClose: !showCancel },
    );

    if (dialogResult) {
      this.resultListValue = dialogResult.resultList;
    }
  }

  public async openElectoratesDialog(): Promise<void> {
    if (!this.resultListValue || !this.resultListValue.electorateSummary || !this.canEditElectorates) {
      return;
    }

    const data: ContestCountingCircleElectoratesUpdateDialogData = {
      contestId: this.resultListValue.contest.id,
      countingCircleId: this.resultListValue.countingCircle.id,
      readonly: this.resultListValue.contest.locked,
      electorates: this.resultListValue.electorateSummary.contestCountingCircleElectoratesList,
    };

    const result = await this.dialogService.openForResult<
      ContestCountingCircleElectoratesUpdateDialogComponent,
      ContestCountingCircleElectoratesUpdateDialogResult
    >(ContestCountingCircleElectoratesUpdateDialogComponent, data);

    if (!result) {
      return;
    }

    for (const vc of this.resultListValue.details.votingCards.filter(vc => vc.channel !== VotingChannel.VOTING_CHANNEL_E_VOTING)) {
      vc.countOfReceivedVotingCards = undefined;
    }

    this.resultListValue.electorateSummary.contestCountingCircleElectoratesList = result.electorates;
    this.resultListValue.electorateSummary.effectiveElectoratesList = [];

    for (const electorate of result.electorates) {
      const doiTypes = electorate.domainOfInfluenceTypesList.filter(doiType => this.domainOfInfluenceTypes.includes(doiType));
      if (doiTypes.length > 0) {
        this.resultListValue.electorateSummary.effectiveElectoratesList.push({
          domainOfInfluenceTypesList: doiTypes,
        });
      }
    }

    const effectiveDoiTypes = flatten(
      this.resultListValue.electorateSummary.effectiveElectoratesList.map(e => e.domainOfInfluenceTypesList),
    );
    const requiredUnusedDoiTypes = this.domainOfInfluenceTypes.filter(doiType => !effectiveDoiTypes.includes(doiType));

    if (requiredUnusedDoiTypes.length > 0) {
      this.resultListValue.electorateSummary.effectiveElectoratesList.push({
        domainOfInfluenceTypesList: requiredUnusedDoiTypes,
      });
    }

    // ascending sort by the first doi type of a electorate.
    this.resultListValue.electorateSummary.effectiveElectoratesList.sort(
      (a, b) => a.domainOfInfluenceTypesList[0] - b.domainOfInfluenceTypesList[0],
    );

    // trigger cd
    this.resultListValue.details.votingCards = [...this.resultListValue.details.votingCards];
  }

  public setFocus(): void {
    this.contestDetailCountOfVotersComponent?.setFocus();
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private async confirmValidationOverviewDialog(): Promise<boolean> {
    if (!this.resultListValue) {
      return false;
    }

    const validationSummary = await this.contestCountingCircleDetailsService.validateUpdateDetails(this.resultListValue.details);

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
