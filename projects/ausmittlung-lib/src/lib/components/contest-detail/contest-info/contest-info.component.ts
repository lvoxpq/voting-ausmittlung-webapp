/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResultList } from '../../../models';

// TODO: can be removed if new UI is standard
@Component({
  selector: 'vo-ausm-contest-info',
  templateUrl: './contest-info.component.html',
  styleUrls: ['./contest-info.component.scss'],
})
export class ContestInfoComponent {
  @Input()
  public contentReadonly: boolean = false;

  @Input()
  public resultList!: ResultList;

  @Input()
  public showSetAllAuditedTentatively: boolean = false;

  @Input()
  public showResetResultsInTestingPhase: boolean = false;

  @Output()
  public finishSubmission: EventEmitter<void> = new EventEmitter<void>();

  public isActionExecuting: boolean = false;
}
