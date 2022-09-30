/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService } from '@abraxas/voting-lib';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contest, ContestState } from '../../models';
import { RoleService } from '../../services/role.service';
import {
  ContestPastUnlockDialogComponent,
  ContestPastUnlockDialogData,
} from '../contest-past-unlock-dialog/contest-past-unlock-dialog.component';

@Component({
  selector: 'vo-ausm-contest-header',
  templateUrl: './contest-header.component.html',
  styleUrls: ['./contest-header.component.scss'],
})
export class ContestHeaderComponent implements OnDestroy, OnChanges {
  public color?: string;
  public foregroundColor: 'dark' | 'light' = 'dark';
  public isErfassungElectionAdmin: boolean = false;
  public isMonitoringElectionAdmin: boolean = false;

  @Input()
  public contest?: Contest;

  public readonly states: typeof ContestState = ContestState;

  private readonly isErfassungElectionAdminSubscription: Subscription;
  private readonly isMonitoringElectionAdminSubscription: Subscription;

  constructor(private readonly dialog: DialogService, roleService: RoleService) {
    this.isErfassungElectionAdminSubscription = roleService.isErfassungElectionAdmin.subscribe(x => {
      this.isErfassungElectionAdmin = x;
    });
    this.isMonitoringElectionAdminSubscription = roleService.isMonitoringElectionAdmin.subscribe(x => {
      this.isMonitoringElectionAdmin = x;
    });
  }

  public openPastUnlockDialog(): void {
    if (!this.contest) {
      return;
    }

    const dialogData: ContestPastUnlockDialogData = {
      contest: this.contest,
    };

    this.dialog.open(ContestPastUnlockDialogComponent, dialogData);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.contest === undefined) {
      return;
    }

    const previousContestValue: Contest = changes.contest.previousValue;
    if (previousContestValue === this.contest) {
      return;
    }

    this.updateColor();
  }

  public ngOnDestroy(): void {
    this.isErfassungElectionAdminSubscription?.unsubscribe();
    this.isMonitoringElectionAdminSubscription?.unsubscribe();
  }

  private updateColor(): void {
    if (!this.contest) {
      this.color = undefined;
      return;
    }

    switch (this.contest.state) {
      case ContestState.CONTEST_STATE_TESTING_PHASE:
        this.color = '#ffa000'; // warning
        this.foregroundColor = 'dark';
        break;
      case ContestState.CONTEST_STATE_PAST_LOCKED:
        this.color = '#c60000'; // error
        this.foregroundColor = 'light';
        break;
      case ContestState.CONTEST_STATE_PAST_UNLOCKED:
        this.color = '#1c9048'; // success
        this.foregroundColor = 'light';
        break;
      default:
        this.color = undefined;
    }
  }
}
