/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DialogService } from '@abraxas/voting-lib';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResultOverview, ResultService } from 'ausmittlung-lib';
import { Subscription } from 'rxjs';
import {
  ExportCockpitDialogComponent,
  ExportCockpitDialogData,
} from '../../components/export-cockpit-dialog/export-cockpit-dialog.component';
import { MonitoringCockpitGridComponent } from '../../components/monitoring-cockpit-grid/monitoring-cockpit-grid.component';
import {
  ResultImportListDialogComponent,
  ResultImportListDialogData,
  ResultImportListDialogResult,
} from '../../components/result-import-list-dialog/result-import-list-dialog.component';

@Component({
  selector: 'app-monitoring-overview',
  templateUrl: './monitoring-overview.component.html',
  styleUrls: ['./monitoring-overview.component.scss'],
})
export class MonitoringOverviewComponent implements OnDestroy {
  public loading: boolean = true;
  public resultOverview?: ResultOverview;
  public newZhFeaturesEnabled: boolean = false;

  @ViewChild(MonitoringCockpitGridComponent)
  public grid!: MonitoringCockpitGridComponent;

  private readonly routeParamsSubscription: Subscription;
  private readonly routeDataSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly resultService: ResultService,
    private readonly dialogService: DialogService,
  ) {
    this.routeParamsSubscription = this.route.params.subscribe(({ contestId }) => this.loadData(contestId));
    this.routeDataSubscription = route.data.subscribe(async ({ contestCantonDefaults }) => {
      this.newZhFeaturesEnabled = contestCantonDefaults.newZhFeaturesEnabled;
    });
  }

  public async ngOnDestroy(): Promise<void> {
    this.routeParamsSubscription.unsubscribe();
    this.routeDataSubscription.unsubscribe();
  }

  public async import(): Promise<void> {
    if (!this.resultOverview) {
      return;
    }

    const result: ResultImportListDialogResult = await this.dialogService.openForResult(ResultImportListDialogComponent, {
      contestId: this.resultOverview.contest.id,
    } as ResultImportListDialogData);
    switch (result) {
      case 'deleted':
        this.resultOverview.contest.eVotingResultsImported = false;
        this.grid.setAllInSubmissionOrCorrection();
        break;
      case 'imported':
        this.grid.setAllInSubmissionOrCorrection();
        break;
    }
  }

  public exportCockpit(): void {
    if (!this.resultOverview) {
      return;
    }

    const data: ExportCockpitDialogData = {
      contestId: this.resultOverview.contest.id,
      politicalBusinesses: this.resultOverview.politicalBusinesses,
    };

    this.dialogService.open(ExportCockpitDialogComponent, data);
  }

  public async export(): Promise<void> {
    if (!this.resultOverview) {
      return;
    }

    await this.router.navigate(['exports'], { relativeTo: this.route });
  }

  private async loadData(contestId: string): Promise<void> {
    this.loading = true;
    try {
      this.resultOverview = await this.resultService.getOverview(contestId);
    } finally {
      this.loading = false;
    }
  }
}
