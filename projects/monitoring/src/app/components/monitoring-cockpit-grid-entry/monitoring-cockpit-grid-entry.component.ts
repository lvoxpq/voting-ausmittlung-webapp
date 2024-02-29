/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultOverviewCountingCircleResult } from 'ausmittlung-lib';

@Component({
  selector: 'app-monitoring-cockpit-grid-entry',
  templateUrl: './monitoring-cockpit-grid-entry.component.html',
  styleUrls: ['./monitoring-cockpit-grid-entry.component.scss'],
})
export class MonitoringCockpitGridEntryComponent {
  @Input()
  public result?: ResultOverviewCountingCircleResult;

  @Input()
  public showDetails: boolean = false;

  @Output()
  public openDetail: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public newZhFeaturesEnabled: boolean = false;
}
