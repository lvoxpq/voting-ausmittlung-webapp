/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { BallotResult } from '../../../../models';

@Component({
  selector: 'vo-ausm-contest-vote-detail-results-graph',
  templateUrl: './contest-vote-detail-results-graph.component.html',
  styleUrls: ['./contest-vote-detail-results-graph.component.scss'],
})
export class ContestVoteDetailResultsGraphComponent {
  @Input()
  public ballotResult?: BallotResult;

  @Input()
  public eVoting: boolean = false;
}
