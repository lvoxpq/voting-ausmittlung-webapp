/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { BallotType } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/vote_pb';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BallotResult } from '../../../../models';
import { BallotCountInputComponent } from '../../../ballot-count-input/ballot-count-input.component';

@Component({
  selector: 'vo-ausm-contest-vote-detail-ballot',
  templateUrl: './contest-vote-detail-ballot.component.html',
  styleUrls: ['./contest-vote-detail-ballot.component.scss'],
})
export class ContestVoteDetailBallotComponent {
  public BallotType: typeof BallotType = BallotType;

  @Input()
  public ballotResult!: BallotResult;

  @Input()
  public eVoting: boolean = true;

  @Input()
  public totalCountOfVoters!: number;

  @Input()
  public readonly: boolean = true;

  @Output()
  public countOfVotersChange: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(BallotCountInputComponent)
  private ballotCountInputComponent!: BallotCountInputComponent;

  public setFocus(): void {
    this.ballotCountInputComponent.setFocus();
  }
}
