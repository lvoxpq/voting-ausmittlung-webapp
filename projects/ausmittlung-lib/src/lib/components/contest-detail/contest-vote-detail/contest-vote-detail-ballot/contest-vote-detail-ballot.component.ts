/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { BallotResult } from '../../../../models';
import { BallotCountInputComponent } from '../../../ballot-count-input/ballot-count-input.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vo-ausm-contest-vote-detail-ballot',
  templateUrl: './contest-vote-detail-ballot.component.html',
  styleUrls: ['./contest-vote-detail-ballot.component.scss'],
})
export class ContestVoteDetailBallotComponent implements OnDestroy {
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

  @Output()
  public countOfAnswersChanged: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(BallotCountInputComponent)
  private ballotCountInputComponent!: BallotCountInputComponent;

  public newZhFeaturesEnabled: boolean = false;

  private readonly routeSubscription: Subscription;

  constructor(route: ActivatedRoute) {
    this.routeSubscription = route.data.subscribe(async ({ contestCantonDefaults }) => {
      this.newZhFeaturesEnabled = contestCantonDefaults.newZhFeaturesEnabled;
    });
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public setFocus(): void {
    this.ballotCountInputComponent.setFocus();
  }
}
