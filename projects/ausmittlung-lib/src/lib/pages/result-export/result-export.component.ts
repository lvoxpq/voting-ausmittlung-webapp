import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contest, CountingCircle, ProtocolExport, ProtocolExportStateChange, ResultExportTemplate } from '../../models';
import { ExportService } from '../../services/export.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ResultExportService } from '../../services/result-export.service';
import { BreadcrumbItem, BreadcrumbsService } from '../../services/breadcrumbs.service';
import { ProtocolExportState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/export_pb';

enum Tabs {
  PROTOCOLS,
  DATA_FILES,
}

@Component({
  selector: 'vo-ausm-result-export',
  templateUrl: './result-export.component.html',
  styleUrls: ['./result-export.component.scss'],
})
export class ResultExportComponent implements OnInit, OnDestroy {
  public readonly defaultColumns = ['select', 'description', 'political-business', 'export-button'];
  public readonly protocolExportColumns = [...this.defaultColumns, 'state', 'data-date', 'file-name', 'download-button'];

  public readonly protocolExportStates: typeof ProtocolExportState = ProtocolExportState;

  public columns: string[] = this.protocolExportColumns;

  public selectedTab: Tabs = Tabs.PROTOCOLS;
  public loadingTemplates: boolean = true;
  public generatingExports: boolean = false;

  public breadcrumbs: BreadcrumbItem[] = [];

  public contest?: Contest;
  public countingCircle?: CountingCircle;
  public templates: MatTableDataSource<ResultExportTemplate> = new MatTableDataSource<ResultExportTemplate>();
  public selectedTemplates = new SelectionModel<ResultExportTemplate>(true, []);
  public allTemplatesSelected: boolean = false;

  private routeParamsSubscription: Subscription = Subscription.EMPTY;

  private contestId: string = '';
  private countingCircleId?: string;
  private stateChangesSubscription?: Subscription;

  constructor(
    private readonly exportService: ExportService,
    private readonly resultExportService: ResultExportService,
    private readonly route: ActivatedRoute,
    private readonly breadcrumbsService: BreadcrumbsService,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.routeParamsSubscription = this.route.params.subscribe(({ contestId, countingCircleId }) => {
      this.contestId = contestId;
      this.countingCircleId = countingCircleId;
      this.loadData();
    });
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.stateChangesSubscription?.unsubscribe();
  }

  public async changeTab(tab: Tabs): Promise<void> {
    this.selectedTab = tab;

    this.columns = tab === Tabs.PROTOCOLS ? this.protocolExportColumns : this.defaultColumns;

    await this.loadData();
  }

  public toggleTemplate(template: ResultExportTemplate, selected?: boolean): void {
    if (selected === this.selectedTemplates.isSelected(template)) {
      return;
    }

    this.selectedTemplates.toggle(template);
    this.updateAllTemplatesSelected();
  }

  public selectAllTemplates(selected: boolean) {
    if (selected === this.allTemplatesSelected) {
      return;
    }

    if (selected) {
      this.selectedTemplates.select(...this.templates.data);
    } else {
      this.selectedTemplates.clear();
    }

    this.updateAllTemplatesSelected();
  }

  public async exportSelected(): Promise<void> {
    await this.export(this.selectedTemplates.selected);
    this.selectedTemplates.clear();
  }

  public async export(templates: ResultExportTemplate[]): Promise<void> {
    this.generatingExports = true;
    try {
      if (this.selectedTab === Tabs.PROTOCOLS) {
        await this.exportService.startProtocolExports(this.contestId, this.countingCircleId, templates);
        for (let template of templates) {
          const protocolExport = template as ProtocolExport;
          protocolExport.started = new Date();
          protocolExport.state = ProtocolExportState.PROTOCOL_EXPORT_STATE_GENERATING;
        }
      } else {
        await this.resultExportService.downloadExports(templates, this.contestId, this.countingCircleId);
      }
    } finally {
      this.generatingExports = false;
    }
  }

  public async downloadProtocolExports(protocolExports: ProtocolExport[]): Promise<void> {
    this.generatingExports = true;
    try {
      await this.resultExportService.downloadProtocolExports(protocolExports, this.contestId, this.countingCircleId);
    } finally {
      this.generatingExports = false;
    }
  }

  private async loadData(): Promise<void> {
    this.loadingTemplates = true;

    try {
      this.selectedTemplates.clear();
      this.updateAllTemplatesSelected();

      const data =
        this.selectedTab === Tabs.PROTOCOLS
          ? await this.exportService.listProtocolExports(this.contestId, this.countingCircleId)
          : await this.exportService.listDataExportTemplates(this.contestId, this.countingCircleId);
      this.contest = data.contest;
      this.countingCircle = data.countingCircle;
      this.templates.data = data.templates;

      this.startStopProtocolExportStateChangeListener();
      this.updateBreadcrumbs();
    } finally {
      this.loadingTemplates = false;
    }
  }

  private startStopProtocolExportStateChangeListener(): void {
    this.stateChangesSubscription?.unsubscribe();

    if (this.selectedTab !== Tabs.PROTOCOLS || !this.contestId) {
      delete this.stateChangesSubscription;
      return;
    }

    this.stateChangesSubscription = this.exportService
      .getProtocolExportStateChanges(this.contestId, this.countingCircleId)
      .subscribe(changed => this.protocolExportStateChanged(changed));
  }

  private protocolExportStateChanged(changed: ProtocolExportStateChange): void {
    const matchingTemplate = this.templates.data.find(t => t.exportTemplateId === changed.exportTemplateId) as ProtocolExport;
    if (!matchingTemplate) {
      return;
    }

    matchingTemplate.protocolExportId = changed.protocolExportId;
    matchingTemplate.state = changed.newState;
    matchingTemplate.started = changed.started;
    matchingTemplate.fileName = changed.fileName;
  }

  private updateAllTemplatesSelected(): void {
    this.allTemplatesSelected = this.selectedTemplates.selected.length === this.templates.data.length;
  }

  private updateBreadcrumbs(): void {
    this.breadcrumbs = this.breadcrumbsService.forExports();
  }
}
