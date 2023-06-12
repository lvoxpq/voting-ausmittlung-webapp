/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MajorityElectionResult, MajorityElectionWriteInMapping } from '../../../../models';
import { BallotCountInputComponent } from '../../../ballot-count-input/ballot-count-input.component';
import { DialogService, ThemeService } from '@abraxas/voting-lib';
import {
  MajorityElectionWriteInMappingDialogComponent,
  ResultImportWriteInMappingDialogData,
} from '../../../majority-election-write-in-mappings/majority-election-write-in-mapping-dialog/majority-election-write-in-mapping-dialog.component';

@Component({
  selector: 'vo-ausm-contest-majority-election-detail-detailed',
  templateUrl: './contest-majority-election-detail-detailed.component.html',
  styleUrls: ['./contest-majority-election-detail-detailed.component.scss'],
})
export class ContestMajorityElectionDetailDetailedComponent {
  @Input()
  public readonly: boolean = true;

  @Input()
  public eVoting: boolean = true;

  @Input()
  public resultDetail!: MajorityElectionResult;

  @Input()
  public showDetailsLink: boolean = false;

  @Input()
  public isErfassungElectionAdmin: boolean = false;

  @Input()
  public isMonitoringElectionAdmin: boolean = false;

  @Output()
  public countOfVotersChange: EventEmitter<void> = new EventEmitter<void>();

  public mappedWriteIns?: MajorityElectionWriteInMapping[];

  @ViewChild(BallotCountInputComponent)
  private ballotCountInputComponent!: BallotCountInputComponent;

  constructor(
    private readonly router: Router,
    private readonly themeService: ThemeService,
    private readonly dialogService: DialogService,
  ) {}

  public async openBallotGroups(): Promise<void> {
    if (!this.resultDetail || (!this.isErfassungElectionAdmin && !this.isMonitoringElectionAdmin)) {
      return;
    }

    await this.router.navigate([this.themeService.theme$.value, 'majority-election-result', this.resultDetail.id, 'ballot-groups']);
  }

  public async openBundles(): Promise<void> {
    if (!this.resultDetail) {
      return;
    }

    await this.router.navigate([this.themeService.theme$.value, 'majority-election-result', this.resultDetail.id, 'bundles']);
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

    const result = await this.dialogService.openForResult(MajorityElectionWriteInMappingDialogComponent, data);
    this.mappedWriteIns = result?.mappings;
  }

  public setFocus(): void {
    this.ballotCountInputComponent.setFocus();
  }
}
