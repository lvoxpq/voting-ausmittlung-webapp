/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DialogService } from '@abraxas/voting-lib';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Permissions } from '../../models/permissions.model';

@Component({
  selector: 'vo-ausm-ballot-header',
  templateUrl: './ballot-header.component.html',
  styleUrls: ['./ballot-header.component.scss'],
})
export class BallotHeaderComponent {
  public readonly deleteBallotPermission = Permissions.PoliticalBusinessResultBallot.Delete;

  @Input()
  public readonly: boolean = true;

  @Input()
  public ballotNumber?: number;

  @Input()
  public maxBallotNumber: number = 0;

  @Input()
  public minBallotNumber: number = 0;

  @Input()
  public labelBallotNumber: string = 'ELECTION.BALLOT_DETAIL.BALLOT_NR';

  @Input()
  public actionExecuting: boolean = false;

  @Input()
  public disabled: boolean = true;

  @Input()
  public canNavigate: boolean = false;

  @Input()
  public canDeleteBallot: boolean = false;

  @Input()
  public labelDelete: string = 'ELECTION.BALLOT_DETAIL.DELETE';

  @Input()
  public labelConfirmDelete: string = 'ELECTION.BALLOT_DETAIL.CONFIRM_DELETE';

  @Output()
  public ballotNumberChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public deleteBallot: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly dialog: DialogService) {}

  @HostListener('document:keydown.control.alt.q', ['$event'])
  public emitDeleteBallot(event?: KeyboardEvent): void {
    if (this.disabled || this.actionExecuting || !this.canDeleteBallot) {
      return;
    }

    event?.preventDefault();
    this.deleteBallot.emit();
  }

  public async confirmDeleteBallot(): Promise<void> {
    const confirmed = await this.dialog.confirm('APP.DELETE', this.labelConfirmDelete, 'APP.DELETE');
    if (!confirmed) {
      return;
    }

    this.deleteBallot.emit();
  }
}
