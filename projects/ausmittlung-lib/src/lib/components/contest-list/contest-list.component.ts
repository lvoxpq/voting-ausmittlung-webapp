/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContestSummary } from '../../models';

@Component({
  selector: 'vo-ausm-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.scss'],
})
export class ContestListComponent {
  public readonly columns: string[] = ['date', 'endOfTestingPhase', 'contestEntriesDetails'];

  @Input()
  public contests: ContestSummary[] = [];

  @Output()
  public openDetail: EventEmitter<ContestSummary> = new EventEmitter<ContestSummary>();
}
