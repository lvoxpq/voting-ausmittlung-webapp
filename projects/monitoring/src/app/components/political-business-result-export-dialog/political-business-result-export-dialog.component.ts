/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { AfterViewChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ContestService,
  ExportService,
  PoliticalBusinessUnion,
  ResultExportDialogTab,
  ResultExportTemplate,
  SimplePoliticalBusiness,
} from 'ausmittlung-lib';

@Component({
  selector: 'app-political-business-result-export-dialog',
  templateUrl: './political-business-result-export-dialog.component.html',
  styleUrls: ['./political-business-result-export-dialog.component.scss'],
})
export class PoliticalBusinessResultExportDialogComponent implements AfterViewChecked {
  public resultExportTemplates: ResultExportTemplate[] = [];

  public politicalBusinesses: SimplePoliticalBusiness[] = [];
  public politicalBusinessUnions?: PoliticalBusinessUnion[];

  public selectedPoliticalBusiness?: SimplePoliticalBusiness;
  public selectedPoliticalBusinessUnion?: PoliticalBusinessUnion;
  public selectedExportDialogTab?: ResultExportDialogTab;

  public contestId: string = '';
  public loading: boolean = false;

  constructor(
    private readonly exportService: ExportService,
    private readonly contestService: ContestService,
    private readonly dialogRef: MatDialogRef<PoliticalBusinessResultExportDialogData>,
    private readonly cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) dialogData: PoliticalBusinessResultExportDialogData,
  ) {
    this.politicalBusinesses = dialogData.politicalBusinesses;
    this.contestId = dialogData.contestId;
  }

  public ngAfterViewChecked(): void {
    // prevent ExpressionChangedAfterItHasBeenCheckedError on properties which are passed to Child Component
    this.cd.detectChanges();
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
    await this.loadSinglePoliticalBusiness();
  }

  public async selectedPoliticalBusinessUnionChanged(politicalBusinessUnion?: PoliticalBusinessUnion): Promise<void> {
    if (!politicalBusinessUnion) {
      this.selectedPoliticalBusinessUnion = undefined;
      return;
    }

    if (this.selectedPoliticalBusinessUnion === politicalBusinessUnion) {
      return;
    }

    this.selectedPoliticalBusinessUnion = politicalBusinessUnion;
    await this.loadSinglePoliticalBusinessUnion();
  }

  public async selectedTabChanged(tab: ResultExportDialogTab): Promise<void> {
    if (this.selectedExportDialogTab === tab) {
      return;
    }

    this.selectedExportDialogTab = tab;
    switch (tab) {
      case ResultExportDialogTab.MULTIPLE_POLITICAL_BUSINESS:
        await this.loadMultiplePoliticalBusiness();
        break;
      case ResultExportDialogTab.CONTEST:
        await this.loadContest();
        break;
      case ResultExportDialogTab.SINGLE_POLITICAL_BUSINESS:
        await this.loadSinglePoliticalBusiness();
        break;
      case ResultExportDialogTab.SINGLE_POLITICAL_BUSINESS_UNION:
        await this.loadSinglePoliticalBusinessUnion();
        break;
    }
  }

  public async done(): Promise<void> {
    this.dialogRef.close();
  }

  private async loadSinglePoliticalBusiness(): Promise<void> {
    if (!this.selectedPoliticalBusiness) {
      this.resultExportTemplates = [];
      return;
    }

    this.loading = true;
    try {
      this.resultExportTemplates = await this.exportService.getPoliticalBusinessResultExportTemplates(this.selectedPoliticalBusiness);
    } finally {
      this.loading = false;
    }
  }

  private async loadSinglePoliticalBusinessUnion(): Promise<void> {
    if (!this.politicalBusinessUnions) {
      await this.loadPoliticalBusinessUnions();
    }

    if (!this.selectedPoliticalBusinessUnion) {
      this.resultExportTemplates = [];
      return;
    }

    this.loading = true;
    try {
      this.resultExportTemplates = await this.exportService.getPoliticalBusinessUnionResultExportTemplates(
        this.selectedPoliticalBusinessUnion,
      );
    } finally {
      this.loading = false;
    }
  }

  private async loadMultiplePoliticalBusiness(): Promise<void> {
    this.loading = true;
    try {
      this.resultExportTemplates = await this.exportService.getMultiplePoliticalBusinessesResultExportTemplates(this.contestId);
    } finally {
      this.loading = false;
    }
  }

  private async loadContest(): Promise<void> {
    this.loading = true;
    try {
      this.resultExportTemplates = await this.exportService.getContestExportTemplates(this.contestId);
    } finally {
      this.loading = false;
    }
  }

  private async loadPoliticalBusinessUnions(): Promise<void> {
    this.loading = true;
    try {
      this.politicalBusinessUnions = await this.contestService.listPoliticalBusinessUnions(this.contestId);

      if (this.politicalBusinessUnions.length > 0) {
        this.selectedPoliticalBusinessUnion = this.politicalBusinessUnions[0];
      }
    } finally {
      this.loading = false;
    }
  }
}

export interface PoliticalBusinessResultExportDialogData {
  politicalBusinesses: SimplePoliticalBusiness[];
  contestId: string;
}
