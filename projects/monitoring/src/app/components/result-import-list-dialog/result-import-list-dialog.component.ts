/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResultImport, ResultImportService } from 'ausmittlung-lib';
import { ResultImportDialogComponent } from '../result-import-dialog/result-import-dialog.component';

export type ResultImportListDialogResult = 'imported' | 'deleted' | undefined;

@Component({
  selector: 'app-result-import-list-dialog',
  templateUrl: './result-import-list-dialog.component.html',
  styleUrls: ['./result-import-list-dialog.component.scss'],
})
export class ResultImportListDialogComponent implements OnInit {
  public readonly columns = ['fileName', 'importType', 'startedBy', 'started'];
  public loading: boolean = true;
  public resultImports: ResultImport[] = [];
  public contestEVotingResultsImported: boolean = false;

  private readonly contestId: string;

  constructor(
    private readonly resultImportService: ResultImportService,
    private readonly dialogService: DialogService,
    private readonly toast: SnackbarService,
    private readonly i18n: TranslateService,
    private readonly dialogRef: MatDialogRef<ResultImportListDialogData>,
    @Inject(MAT_DIALOG_DATA) dialogData: ResultImportListDialogData,
  ) {
    this.contestId = dialogData.contestId;
  }

  public async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      this.resultImports = await this.resultImportService.listImportedResultFiles(this.contestId);

      if (this.resultImports.length === 0) {
        await this.showImportDialog();
      } else {
        this.contestEVotingResultsImported = !this.resultImports[0].deleted;
      }
    } finally {
      this.loading = false;
    }
  }

  public close(result?: ResultImportListDialogResult): void {
    this.dialogRef.close(result);
  }

  public async showImportDialog(): Promise<void> {
    const imported = await this.dialogService.openForResult(ResultImportDialogComponent, { contestId: this.contestId });
    this.close(imported ? 'imported' : undefined);
  }

  public async deleteResults(): Promise<void> {
    const ok = await this.dialogService.confirm('RESULT_IMPORT.DELETE_CONFIRM_TITLE', 'RESULT_IMPORT.DELETE_CONFIRM_MSG');
    if (!ok) {
      return;
    }

    try {
      this.loading = true;
      await this.resultImportService.deleteResultImportData(this.contestId);
      this.toast.success(this.i18n.instant('RESULT_IMPORT.DELETE_SUCCESS'));
    } finally {
      this.loading = false;
    }

    this.close('deleted');
  }
}

export interface ResultImportListDialogData {
  contestId: string;
}
