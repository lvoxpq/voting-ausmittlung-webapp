/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService } from '@abraxas/voting-lib';
import { Component, Input, OnDestroy } from '@angular/core';
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
export class ContestHeaderComponent implements OnDestroy {
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

  public ngOnDestroy(): void {
    this.isErfassungElectionAdminSubscription?.unsubscribe();
    this.isMonitoringElectionAdminSubscription?.unsubscribe();
  }
}
