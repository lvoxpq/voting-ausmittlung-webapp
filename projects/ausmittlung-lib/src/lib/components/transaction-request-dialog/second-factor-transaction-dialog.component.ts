/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vo-ausm-second-factor-transaction-dialog',
  templateUrl: './second-factor-transaction-dialog.component.html',
  styleUrls: ['./second-factor-transaction-dialog.component.scss'],
})
export class SecondFactorTransactionDialogComponent {
  public hasError: boolean = false;
  public code: string;

  constructor(
    private readonly dialogRef: MatDialogRef<SecondFactorTransactionDialogData>,
    @Inject(MAT_DIALOG_DATA) dialogData: SecondFactorTransactionDialogData,
  ) {
    this.code = dialogData.code;
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}

export interface SecondFactorTransactionDialogData {
  code: string;
}
