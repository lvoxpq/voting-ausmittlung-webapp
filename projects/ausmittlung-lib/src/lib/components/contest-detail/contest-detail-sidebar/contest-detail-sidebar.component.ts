/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ContestCountingCircleDetails, DomainOfInfluenceType, ResultList } from '../../../models';
import { ContestCountingCircleDetailsService } from '../../../services/contest-counting-circle-details.service';
import { RoleService } from '../../../services/role.service';
import { distinct } from '../../../services/utils/array.utils';
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

@Component({
  selector: 'vo-ausm-contest-detail-sidebar',
  templateUrl: './contest-detail-sidebar.component.html',
  styleUrls: ['./contest-detail-sidebar.component.scss'],
})
export class ContestDetailSidebarComponent {
  @Input()
  public readonly: boolean = true;

  @Output()
  public saved: EventEmitter<ContestCountingCircleDetails> = new EventEmitter<ContestCountingCircleDetails>();

  public saving: boolean = false;
  public isErfassungElectionAdmin: Observable<boolean>;

  public resultListValue?: ResultList;
  public domainOfInfluenceTypes: DomainOfInfluenceType[] = [];

  @ViewChild(ContestDetailCountOfVotersComponent)
  private contestDetailCountOfVotersComponent?: ContestDetailCountOfVotersComponent;

  constructor(
    private readonly contestCountingCircleDetailsService: ContestCountingCircleDetailsService,
    private readonly toast: SnackbarService,
    private readonly i18n: TranslateService,
    private readonly dialogService: DialogService,
    roleService: RoleService,
  ) {
    this.isErfassungElectionAdmin = roleService.isErfassungElectionAdmin;
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

  public setFocus(): void {
    this.contestDetailCountOfVotersComponent?.setFocus();
  }

  private async confirmValidationOverviewDialog(): Promise<boolean> {
    if (!this.resultListValue) {
      return false;
    }

    const validationOverview = await this.contestCountingCircleDetailsService.validateUpdateDetails(this.resultListValue.details);

    const data: ValidationOverviewDialogData = {
      validationOverview,
      canEmitSave: validationOverview.isValid,
      header: `VALIDATION.CONTEST_COUNTING_CIRCLE_DETAILS.HEADER.${validationOverview.isValid ? 'VALID' : 'INVALID'}`,
      saveLabel: !validationOverview.isValid ? 'APP.CONTINUE' : 'COMMON.SAVE',
    };

    const result = await this.dialogService.openForResult<ValidationOverviewDialogComponent, ValidationOverviewDialogResult>(
      ValidationOverviewDialogComponent,
      data,
    );

    return !!result && result.save;
  }
}
