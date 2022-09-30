/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MajorityElectionResult } from '../../../../models';
import { BallotCountInputComponent } from '../../../ballot-count-input/ballot-count-input.component';
import { ThemeService } from '@abraxas/voting-lib';

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

  @ViewChild(BallotCountInputComponent)
  private ballotCountInputComponent!: BallotCountInputComponent;

  constructor(private readonly router: Router, private readonly themeService: ThemeService) {}

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

  public setFocus(): void {
    this.ballotCountInputComponent.setFocus();
  }
}
