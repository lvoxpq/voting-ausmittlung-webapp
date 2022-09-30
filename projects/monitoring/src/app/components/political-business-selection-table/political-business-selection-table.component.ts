/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { arraysEqual, groupBySingle, SimplePoliticalBusiness } from 'ausmittlung-lib';

@Component({
  selector: 'app-political-business-selection-table',
  templateUrl: './political-business-selection-table.component.html',
})
export class PoliticalBusinessSelectionTableComponent implements OnChanges {
  public readonly columns = ['select', 'politicalBusinessNumber', 'shortDescription', 'doiType', 'politicalBusinessType'];

  @Input()
  public politicalBusinesses: SimplePoliticalBusiness[] = [];

  @Input()
  public selectedPoliticalBusinessIds: string[] = [];

  @Output()
  public selectedPoliticalBusinessIdsChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  public readonly selection = new SelectionModel<SimplePoliticalBusiness>(true, []);
  public isAllSelected: boolean = false;
  private politicalBusinessesById: Record<string, SimplePoliticalBusiness> = {};

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.politicalBusinesses) {
      this.politicalBusinessesById = groupBySingle(
        this.politicalBusinesses,
        x => x.id,
        x => x,
      );
    }

    if (
      arraysEqual(
        this.selectedPoliticalBusinessIds,
        this.selection.selected.map(({ id }) => id),
      )
    ) {
      return;
    }

    const selectedPoliticalBusinesses = this.selectedPoliticalBusinessIds.map(x => this.politicalBusinessesById[x]);
    this.selection.clear();
    this.selection.select(...selectedPoliticalBusinesses);
  }

  public toggleAllRows(value: boolean) {
    if (value === this.isAllSelected) {
      return;
    }

    value ? this.selection.select(...this.politicalBusinesses) : this.selection.clear();
    this.updateSelectedIds();
    this.updateIsAllSelected();
  }

  public toggleRowWithValue(row: SimplePoliticalBusiness, value: boolean): void {
    if (value === this.selection.isSelected(row)) {
      return;
    }

    this.selection.toggle(row);
    this.updateSelectedIds();
    this.updateIsAllSelected();
  }

  private updateSelectedIds(): void {
    this.selectedPoliticalBusinessIds = this.selection.selected.map(x => x.id);
    this.selectedPoliticalBusinessIdsChange.emit(this.selectedPoliticalBusinessIds);
  }

  private updateIsAllSelected(): void {
    const numSelected = this.selection.selected.length;
    const numRows = this.politicalBusinesses.length;
    this.isAllSelected = numSelected === numRows;
  }
}
