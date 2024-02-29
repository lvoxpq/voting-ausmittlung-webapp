/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CountingCircle } from '../../models';

@Component({
  selector: 'vo-ausm-select-counting-circle-dialog',
  templateUrl: './select-counting-circle-dialog.component.html',
  styleUrls: ['./select-counting-circle-dialog.component.scss'],
})
export class SelectCountingCircleDialogComponent {
  public readonly countingCircles: CountingCircle[];

  constructor(
    private readonly dialogRef: MatDialogRef<SelectCountingCircleDialogData, SelectCountingCircleDialogResult>,
    @Inject(MAT_DIALOG_DATA) dialogData: SelectCountingCircleDialogData,
  ) {
    this.countingCircles = dialogData.countingCircles;
  }

  public done(countingCircle?: CountingCircle): void {
    this.dialogRef.close({
      selectedCountingCircle: countingCircle,
    });
  }
}

export interface SelectCountingCircleDialogData {
  countingCircles: CountingCircle[];
}

export interface SelectCountingCircleDialogResult {
  selectedCountingCircle?: CountingCircle;
}
