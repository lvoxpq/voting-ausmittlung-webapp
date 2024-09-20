/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { cloneDeep } from 'lodash';
import { CountingCircle, ResultList } from '../../../../models';
import { ContestCountingCircleContactPersonService } from '../../../../services/contest-counting-circle-contact-person.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// TODO: can be removed if new UI is standard
@Component({
  selector: 'vo-ausm-contact-person-edit-dialog',
  templateUrl: './contact-person-edit-dialog.component.html',
  styleUrls: ['./contact-person-edit-dialog.component.scss'],
})
export class ContactPersonEditDialogComponent {
  public readonly resultList: ResultList;
  public readonly countingCircle: CountingCircle;
  public readonly showCancel: boolean;
  public saving: boolean = false;

  constructor(
    private readonly dialogRef: MatDialogRef<ContactPersonEditDialogResult>,
    private readonly contactPersonService: ContestCountingCircleContactPersonService,
    @Inject(MAT_DIALOG_DATA) dialogData: ContactPersonEditDialogData,
  ) {
    this.resultList = cloneDeep(dialogData.resultList);
    this.countingCircle = this.resultList.countingCircle;
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

export interface ContactPersonEditDialogData {
  resultList: ResultList;
  showCancel: boolean;
}

export interface ContactPersonEditDialogResult {
  resultList: ResultList;
}
