/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MajorityElection, MajorityElectionResult } from '../../../../models';
import { BallotCountInputComponent } from '../../../ballot-count-input/ballot-count-input.component';
import {
  MajorityElectionWriteInMappingDialogComponent,
  ResultImportWriteInMappingDialogData,
} from '../../../majority-election-write-in-mappings/majority-election-write-in-mapping-dialog/majority-election-write-in-mapping-dialog.component';
import { DialogService } from '@abraxas/voting-lib';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vo-ausm-contest-majority-election-detail-final-results',
  templateUrl: './contest-majority-election-detail-final-results.component.html',
  styleUrls: ['./contest-majority-election-detail-final-results.component.scss'],
})
export class ContestMajorityElectionDetailFinalResultsComponent implements OnDestroy {
  @Input()
  public readonly: boolean = true;

  @Input()
  public eVoting: boolean = true;

  @Input()
  public resultDetail!: MajorityElectionResult;

  @Input()
  public election!: MajorityElection;

  @Output()
  public countOfVotersChange: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public candidateResultChange: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(BallotCountInputComponent)
  private ballotCountInputComponent!: BallotCountInputComponent;

  public newZhFeaturesEnabled: boolean = false;

  private readonly routeSubscription: Subscription;

  constructor(private readonly dialogService: DialogService, route: ActivatedRoute) {
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

  public async openWriteIns(electionId: string): Promise<void> {
    if (!this.resultDetail || !this.resultDetail.election.contest) {
      return;
    }

    const data: ResultImportWriteInMappingDialogData = {
      contestId: this.resultDetail.election.contest.id,
      countingCircleId: this.resultDetail.countingCircle.id,
      electionId: electionId,
    };

    this.dialogService.open(MajorityElectionWriteInMappingDialogComponent, data);
  }
}
