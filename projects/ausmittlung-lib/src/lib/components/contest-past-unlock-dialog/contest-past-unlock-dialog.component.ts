/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contest } from '../../models';
import { VOTING_BASIS_WEBAPP_URL } from '../../tokens';

@Component({
  selector: 'vo-ausm-contest-past-unlock-dialog',
  templateUrl: './contest-past-unlock-dialog.component.html',
})
export class ContestPastUnlockDialogComponent {
  public readonly contest: Contest;

  constructor(
    @Inject(VOTING_BASIS_WEBAPP_URL) public readonly votingBasisWebAppUrl: string,
    @Inject(MAT_DIALOG_DATA) dialogData: ContestPastUnlockDialogData,
    private readonly dialogRef: MatDialogRef<any>,
  ) {
    this.contest = dialogData.contest;
  }

  public redirect(): void {
    window.open(this.votingBasisWebAppUrl, '_blank')?.focus();
    this.close();
  }

  public close(): void {
    this.dialogRef.close();
  }
}

export interface ContestPastUnlockDialogData {
  contest: Contest;
}
