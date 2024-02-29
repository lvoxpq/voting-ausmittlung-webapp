/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResultImportService } from 'ausmittlung-lib';
import { EchType, ImportFile } from './import-file.model';

@Component({
  selector: 'app-result-import-dialog',
  templateUrl: './result-import-dialog.component.html',
})
export class ResultImportDialogComponent {
  public importing: boolean = false;
  public files: ImportFile[] = [];
  public filesValid: boolean = false;

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

  public filesChanged(files: ImportFile[]): void {
    this.files = files;
    this.filesValid =
      files.length === 2 && files.some(f => f.echType === EchType.Ech0222) && files.some(f => f.echType === EchType.Ech0110);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public async import(): Promise<void> {
    if (!this.filesValid) {
      return;
    }

    try {
      this.importing = true;
      const eCH0222File = this.files.find(f => f.echType === EchType.Ech0222)!;
      const eCH0110File = this.files.find(f => f.echType === EchType.Ech0110)!;
      await this.resultImportService.import(this.contestId, eCH0222File.file, eCH0110File.file);
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
