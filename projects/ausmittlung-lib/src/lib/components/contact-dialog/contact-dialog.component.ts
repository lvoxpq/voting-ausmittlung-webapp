/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { CountingCircle, DomainOfInfluence, ResultList } from '../../models';
import { cloneDeep } from 'lodash';
import { ContactPersonEditDialogResult } from '../contest-detail/contest-detail-sidebar/contact-person-edit-dialog/contact-person-edit-dialog.component';
import { ContestCountingCircleContactPersonService } from '../../services/contest-counting-circle-contact-person.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vo-ausm-contact-dialog',
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
})
export class ContactDialogComponent {
  public readonly domainOfInfluences: DomainOfInfluence[];
  public readonly resultList: ResultList;
  public readonly countingCircle: CountingCircle;
  public readonly readonly: boolean;
  public readonly showCancel: boolean;
  public saving: boolean = false;

  constructor(
    private readonly dialogRef: MatDialogRef<ContactDialogResult>,
    private readonly contactPersonService: ContestCountingCircleContactPersonService,
    @Inject(MAT_DIALOG_DATA) dialogData: ContactDialogComponentData,
  ) {
    this.domainOfInfluences = dialogData.domainOfInfluences;
    this.resultList = cloneDeep(dialogData.resultList);
    this.countingCircle = this.resultList.countingCircle;
    this.readonly = dialogData.readonly;
    this.showCancel = dialogData.showCancel;
  }

  public async save(): Promise<void> {
    this.saving = true;

    try {
      if (!this.resultList.contestCountingCircleContactPersonId) {
        await this.createContactPerson();
      } else {
        await this.updateContactPerson();
      }

      this.resultList.mustUpdateContactPersons = false;
      const dialogResult: ContactPersonEditDialogResult = {
        resultList: this.resultList,
      };
      this.dialogRef.close(dialogResult);
    } finally {
      this.saving = false;
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  private async createContactPerson(): Promise<void> {
    this.resultList.contestCountingCircleContactPersonId = await this.contactPersonService.create(
      this.resultList.contest.id,
      this.resultList.countingCircle.id,
      this.countingCircle.contactPersonDuringEvent!,
      this.countingCircle.contactPersonSameDuringEventAsAfter,
      this.countingCircle.contactPersonSameDuringEventAsAfter ? undefined : this.countingCircle.contactPersonAfterEvent,
    );
  }

  private updateContactPerson(): Promise<void> {
    return this.contactPersonService.update(
      this.resultList.contestCountingCircleContactPersonId,
      this.countingCircle.contactPersonDuringEvent!,
      this.countingCircle.contactPersonSameDuringEventAsAfter,
      this.countingCircle.contactPersonSameDuringEventAsAfter ? undefined : this.countingCircle.contactPersonAfterEvent,
    );
  }
}

export interface ContactDialogComponentData {
  domainOfInfluences: DomainOfInfluence[];
  resultList: ResultList;
  readonly: boolean;
  showCancel: boolean;
}

export interface ContactDialogResult {
  resultList: ResultList;
}
