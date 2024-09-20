/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { VotingDataSource } from '../../models';

@Component({
  selector: 'vo-ausm-voting-data-source-tabs',
  templateUrl: './voting-data-source-tabs.component.html',
  styleUrls: ['./voting-data-source-tabs.component.scss'],
})
export class VotingDataSourceTabsComponent {
  @Output()
  public dataSourceChange: EventEmitter<VotingDataSource> = new EventEmitter<VotingDataSource>();

  public changeDataSource(index: number): void {
    let dataSource = VotingDataSource.Total;

    switch (index) {
      case 0:
        dataSource = VotingDataSource.Total;
        break;
      case 1:
        dataSource = VotingDataSource.Conventional;
        break;
      case 2:
        dataSource = VotingDataSource.EVoting;
        break;
    }

    this.dataSourceChange.emit(dataSource);
  }
}
