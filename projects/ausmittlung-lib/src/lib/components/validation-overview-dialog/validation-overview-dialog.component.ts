/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidationOverview } from '../../models';

@Component({
  selector: 'vo-ausm-validation-overview-dialog',
  templateUrl: './validation-overview-dialog.component.html',
})
export class ValidationOverviewDialogComponent {
  public readonly validationOverview: ValidationOverview;
  public readonly saveLabel: string;
  public readonly header: string;
  public readonly canEmitSave: boolean;
  public readonly validationResultsLabel?: string;

  constructor(private readonly dialogRef: MatDialogRef<boolean>, @Inject(MAT_DIALOG_DATA) dialogData: ValidationOverviewDialogData) {
    this.validationOverview = dialogData.validationOverview;
    this.saveLabel = dialogData.saveLabel;
    this.header = dialogData.header;
    this.canEmitSave = dialogData.canEmitSave;
    this.validationResultsLabel = dialogData.validationResultsLabel;
  }

  public close(): void {
    this.dialogRef.close();
  }

  public save(): void {
    const result: ValidationOverviewDialogResult = {
      save: this.canEmitSave,
    };

    this.dialogRef.close(result);
  }
}

export interface ValidationOverviewDialogData {
  validationOverview: ValidationOverview;
  canEmitSave: boolean;
  saveLabel: string;
  header: string;
  validationResultsLabel?: string;
}

export interface ValidationOverviewDialogResult {
  save: boolean;
}
