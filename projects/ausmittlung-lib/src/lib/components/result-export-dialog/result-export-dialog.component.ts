/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PoliticalBusinessUnion, ResultExportTemplate, SimplePoliticalBusiness } from '../../models';
import { ResultExportService } from '../../services/result-export.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AdvancedTablePaginatorComponent } from '@abraxas/base-components';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'vo-ausm-result-export-dialog',
  templateUrl: './result-export-dialog.component.html',
  styleUrls: ['./result-export-dialog.component.scss'],
})
export class ResultExportDialogComponent implements AfterViewInit {
  public readonly ResultExportDialogTab: typeof ResultExportDialogTab = ResultExportDialogTab;
  public readonly selection = new SelectionModel<ResultExportTemplate>(true, []);
  public isAllSelected: boolean = false;
  public visibleTabs: Set<ResultExportDialogTab>;
  public downloading: boolean = false;
  public readonly dataSource: MatTableDataSource<ResultExportTemplate> = new MatTableDataSource<ResultExportTemplate>();
  public selectedTabIndex: number = 0;

  @Input()
  public contestId: string = '';

  @Input()
  public set resultExportTemplates(templates: ResultExportTemplate[]) {
    this.dataSource.data = templates;
    this.selection.clear();
  }

  @Input()
  public loading: boolean = false;

  @Output()
  public selectedTabChange: EventEmitter<ResultExportDialogTab> = new EventEmitter<ResultExportDialogTab>();

  @Output()
  public selectedPoliticalBusinessChange: EventEmitter<SimplePoliticalBusiness> = new EventEmitter<SimplePoliticalBusiness>();

  @Output()
  public selectedPoliticalBusinessUnionChange: EventEmitter<PoliticalBusinessUnion> = new EventEmitter<PoliticalBusinessUnion>();

  @Output()
  public done: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(AdvancedTablePaginatorComponent)
  public paginator!: AdvancedTablePaginatorComponent;

  private selectedPoliticalBusinessValue?: SimplePoliticalBusiness;
  private selectedPoliticalBusinessUnionValue?: PoliticalBusinessUnion;
  private politicalBusinessesValue: SimplePoliticalBusiness[] = [];
  private politicalBusinessUnionsValue: PoliticalBusinessUnion[] = [];

  constructor(private readonly resultExportService: ResultExportService) {
    this.visibleTabs = new Set<ResultExportDialogTab>();
    this.visibleTabs.add(ResultExportDialogTab.SINGLE_POLITICAL_BUSINESS);
    this.visibleTabs.add(ResultExportDialogTab.MULTIPLE_POLITICAL_BUSINESS);
    this.visibleTabs.add(ResultExportDialogTab.CONTEST);
    this.visibleTabs.add(ResultExportDialogTab.SINGLE_POLITICAL_BUSINESS_UNION);
  }

  @Input()
  public set availableTabs(tabs: ResultExportDialogTab[]) {
    this.visibleTabs = new Set<ResultExportDialogTab>(tabs);
  }

  public get politicalBusinesses(): SimplePoliticalBusiness[] {
    return this.politicalBusinessesValue;
  }

  @Input()
  public set politicalBusinesses(v: SimplePoliticalBusiness[]) {
    if (this.politicalBusinessesValue === v) {
      return;
    }

    this.politicalBusinessesValue = v;
    if (v.length > 0) {
      this.selectedPoliticalBusiness = v[0];
    }
  }

  public get politicalBusinessUnions(): PoliticalBusinessUnion[] {
    return this.politicalBusinessUnionsValue;
  }

  @Input()
  public set politicalBusinessUnions(v: PoliticalBusinessUnion[]) {
    if (this.politicalBusinessUnionsValue === v) {
      return;
    }

    this.politicalBusinessUnionsValue = v;
    if (v.length > 0) {
      this.selectedPoliticalBusinessUnion = v[0];
    }
  }

  public get selectedPoliticalBusiness(): SimplePoliticalBusiness | undefined {
    return this.selectedPoliticalBusinessValue;
  }

  public set selectedPoliticalBusiness(v: SimplePoliticalBusiness | undefined) {
    if (this.selectedPoliticalBusinessValue === v) {
      return;
    }
    this.selectedPoliticalBusinessValue = v;
    this.selectedPoliticalBusinessChange.emit(v);
  }

  public get selectedPoliticalBusinessUnion(): PoliticalBusinessUnion | undefined {
    return this.selectedPoliticalBusinessUnionValue;
  }

  public set selectedPoliticalBusinessUnion(v: PoliticalBusinessUnion | undefined) {
    if (this.selectedPoliticalBusinessUnionValue === v) {
      return;
    }
    this.selectedPoliticalBusinessUnionValue = v;
    this.selectedPoliticalBusinessUnionChange.emit(v);
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public cancel(): void {
    this.done.emit();
  }

  public async save(): Promise<void> {
    this.downloading = true;
    try {
      await this.resultExportService.downloadExports(this.selection.selected, this.contestId);
    } finally {
      this.downloading = false;
    }
    this.done.emit();
  }

  public onTabChange(index: number): void {
    this.selectedTabIndex = index;

    for (let i = 0; i <= index; i++) {
      if (!this.visibleTabs.has(i)) {
        // Tab is not visible, index must be increased since a tab is "missing"
        index++;
      }
    }

    this.selectedTabChange.emit(index);
  }

  public toggleAllRows(value: boolean) {
    if (value === this.isAllSelected) {
      return;
    }

    value ? this.selection.select(...this.dataSource.data) : this.selection.clear();
    this.updateIsAllSelected();
  }

  public toggleRowWithValue(row: ResultExportTemplate, value: boolean): void {
    if (value === this.selection.isSelected(row)) {
      return;
    }

    this.selection.toggle(row);
    this.updateIsAllSelected();
  }

  private updateIsAllSelected(): void {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.isAllSelected = numSelected === numRows;
  }
}

// These need to have the same order as in the template (e.g. the contest tab must be at index 2)
export enum ResultExportDialogTab {
  SINGLE_POLITICAL_BUSINESS,
  MULTIPLE_POLITICAL_BUSINESS,
  CONTEST,
  SINGLE_POLITICAL_BUSINESS_UNION,
}
