/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Input } from '@angular/core';
import { BallotBundleState } from '../../models';

@Component({
  selector: 'vo-ausm-election-bundle-state-chip',
  templateUrl: './election-bundle-state-chip.component.html',
})
export class ElectionBundleStateChipComponent {
  public stateValue!: BallotBundleState;
  public color!: string;
  public foregroundColor: 'dark' | 'light' = 'dark';

  @Input()
  public set state(state: BallotBundleState) {
    this.stateValue = state;

    switch (state) {
      case BallotBundleState.BALLOT_BUNDLE_STATE_READY_FOR_REVIEW:
        this.color = '#ffa000'; // warning
        this.foregroundColor = 'dark';
        break;
      case BallotBundleState.BALLOT_BUNDLE_STATE_REVIEWED:
        this.color = '#1c9048'; // success
        this.foregroundColor = 'light';
        break;
      case BallotBundleState.BALLOT_BUNDLE_STATE_DELETED:
      case BallotBundleState.BALLOT_BUNDLE_STATE_IN_CORRECTION:
        this.color = '#c60000'; // error
        this.foregroundColor = 'light';
        break;
      default: // info
        this.color = '#1c69ce';
        this.foregroundColor = 'light';
    }
  }
}
