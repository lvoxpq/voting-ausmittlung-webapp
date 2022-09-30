/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResultExportTemplate, ResultListResult, SimplePoliticalBusiness } from '../../models';
import { ExportService } from '../../services/export.service';
import { ResultExportDialogTab } from '../result-export-dialog/result-export-dialog.component';

@Component({
  selector: 'vo-ausm-counting-circle-result-export-dialog',
  templateUrl: './counting-circle-result-export-dialog.component.html',
})
export class CountingCircleResultExportDialogComponent implements OnInit, AfterViewChecked {
  public readonly availableTabs: ResultExportDialogTab[] = [
    ResultExportDialogTab.SINGLE_POLITICAL_BUSINESS,
    ResultExportDialogTab.MULTIPLE_POLITICAL_BUSINESS,
  ];
  public resultExportTemplates: ResultExportTemplate[] = [];
  public countingCircleResults: ResultListResult[] = [];
  public politicalBusinesses: SimplePoliticalBusiness[] = [];
  public selectedPoliticalBusiness?: SimplePoliticalBusiness;
  public loading: boolean = false;
  public contestId: string = '';

  private readonly countingCircleId: string;
  private selectedExportDialogTab: ResultExportDialogTab = ResultExportDialogTab.SINGLE_POLITICAL_BUSINESS;

  constructor(
    private readonly exportService: ExportService,
    private readonly dialogRef: MatDialogRef<CountingCircleResultExportDialogData>,
    private readonly cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) dialogData: CountingCircleResultExportDialogData,
  ) {
    this.countingCircleId = dialogData.countingCircleId;
    this.countingCircleResults = dialogData.countingCircleResults;
    this.politicalBusinesses = this.countingCircleResults.map(r => r.politicalBusiness);
    this.selectedPoliticalBusiness = this.politicalBusinesses[0];
    this.contestId = dialogData.contestId;
  }

  public async ngOnInit(): Promise<void> {
    await this.loadSinglePoliticalBusinessTemplates();
  }

  public ngAfterViewChecked(): void {
    // prevent ExpressionChangedAfterItHasBeenCheckedError on properties which are passed to Child Component
    this.cd.detectChanges();
  }

  public async selectedTabChanged(tab: ResultExportDialogTab): Promise<void> {
    if (this.selectedExportDialogTab === tab) {
      return;
    }

    this.selectedExportDialogTab = tab;
    await this.loadTemplates();
  }

  public async selectedPoliticalBusinessChanged(politicalBusiness?: SimplePoliticalBusiness): Promise<void> {
    if (!politicalBusiness) {
      this.selectedPoliticalBusiness = undefined;
      return;
    }

    if (this.selectedPoliticalBusiness === politicalBusiness) {
      return;
    }

    this.selectedPoliticalBusiness = politicalBusiness;
    await this.loadTemplates();
  }

  public async done(): Promise<void> {
    this.dialogRef.close();
  }

  private async loadTemplates(): Promise<void> {
    this.loading = true;
    try {
      switch (this.selectedExportDialogTab) {
        case ResultExportDialogTab.MULTIPLE_POLITICAL_BUSINESS:
          await this.loadMultiplePoliticalBusinessTemplates();
          break;
        case ResultExportDialogTab.SINGLE_POLITICAL_BUSINESS:
          await this.loadSinglePoliticalBusinessTemplates();
          break;
      }
    } finally {
      this.loading = false;
    }
  }

  private async loadMultiplePoliticalBusinessTemplates(): Promise<void> {
    this.resultExportTemplates = await this.exportService.getMultiplePoliticalBusinessesCountingCircleResultExportTemplates(
      this.contestId,
      this.countingCircleId,
    );
  }

  private async loadSinglePoliticalBusinessTemplates(): Promise<void> {
    if (!this.selectedPoliticalBusiness) {
      return;
    }

    this.resultExportTemplates = await this.exportService.getCountingCircleResultExportTemplates(
      this.countingCircleId,
      this.selectedPoliticalBusiness,
    );
  }
}

export interface CountingCircleResultExportDialogData {
  countingCircleResults: ResultListResult[];
  contestId: string;
  countingCircleId: string;
}
