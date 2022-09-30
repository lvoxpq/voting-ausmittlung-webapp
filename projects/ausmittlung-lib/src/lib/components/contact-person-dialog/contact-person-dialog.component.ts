/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactPerson } from '../../models';

@Component({
  selector: 'vo-ausm-contact-person-dialog',
  templateUrl: './contact-person-dialog.component.html',
})
export class ContactPersonDialogComponent {
  public readonly contactPerson: ContactPerson;
  public readonly isEmpty: boolean;

  constructor(
    private readonly dialogRef: MatDialogRef<ContactPersonDialogComponentData>,
    @Inject(MAT_DIALOG_DATA) dialogData: ContactPersonDialogComponentData,
  ) {
    this.contactPerson = dialogData.contactPerson;
    this.isEmpty = Object.values(this.contactPerson).every(v => !v);
  }

  public done(): void {
    this.dialogRef.close();
  }
}

export interface ContactPersonDialogComponentData {
  contactPerson: ContactPerson;
}
