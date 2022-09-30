/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResultImportService } from 'ausmittlung-lib';

@Component({
  selector: 'app-result-import-dialog',
  templateUrl: './result-import-dialog.component.html',
})
export class ResultImportDialogComponent {
  public importing: boolean = false;
  public file?: File;

  private readonly contestId: string;

  constructor(
    private readonly resultImportService: ResultImportService,
    private readonly dialogRef: MatDialogRef<ResultImportDialogData>,
    private readonly dialogService: DialogService,
    private readonly toast: SnackbarService,
    private readonly i18n: TranslateService,
    @Inject(MAT_DIALOG_DATA) dialogData: ResultImportDialogData,
  ) {
    this.contestId = dialogData.contestId;
  }

  public close(): void {
    this.dialogRef.close();
  }

  public async import(): Promise<void> {
    if (!this.file) {
      return;
    }

    try {
      this.importing = true;
      await this.resultImportService.import(this.contestId, this.file);
      this.toast.success(this.i18n.instant('RESULT_IMPORT.IMPORT_DONE'));
      this.dialogRef.close(true);
    } finally {
      this.importing = false;
    }
  }
}

export interface ResultImportDialogData {
  contestId: string;
}
