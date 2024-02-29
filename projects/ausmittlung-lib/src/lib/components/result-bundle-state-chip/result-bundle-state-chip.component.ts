/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { BallotBundleState } from '../../models';

@Component({
  selector: 'vo-ausm-result-bundle-state-chip',
  templateUrl: './result-bundle-state-chip.component.html',
})
export class ResultBundleStateChipComponent {
  public stateValue!: BallotBundleState;
  public newZhFeaturesEnabledValue: boolean = false;
  public color!: string;
  public foregroundColor: 'dark' | 'light' = 'dark';

  @Input()
  public set newZhFeaturesEnabled(newZhFeaturesEnabled: boolean) {
    this.newZhFeaturesEnabledValue = newZhFeaturesEnabled;
    this.updateStateColor(this.stateValue);
  }

  @Input()
  public set state(state: BallotBundleState) {
    this.stateValue = state;
    this.updateStateColor(state);
  }

  private updateStateColor(state: BallotBundleState): void {
    switch (state) {
      case BallotBundleState.BALLOT_BUNDLE_STATE_READY_FOR_REVIEW:
        this.color = this.newZhFeaturesEnabledValue ? '#c4e6c3' : '#ffa000';
        this.foregroundColor = 'dark';
        break;
      case BallotBundleState.BALLOT_BUNDLE_STATE_REVIEWED:
        this.color = this.newZhFeaturesEnabledValue ? '#95d2a4' : '#1c9048';
        this.foregroundColor = this.newZhFeaturesEnabledValue ? 'dark' : 'light';
        break;
      case BallotBundleState.BALLOT_BUNDLE_STATE_DELETED:
      case BallotBundleState.BALLOT_BUNDLE_STATE_IN_CORRECTION:
        this.color = this.newZhFeaturesEnabledValue ? '#fec6c3' : '#c60000';
        this.foregroundColor = this.newZhFeaturesEnabledValue ? 'dark' : 'light';
        break;
      default:
        this.color = this.newZhFeaturesEnabledValue ? '#fbe5c4' : '#1c69ce';
        this.foregroundColor = this.newZhFeaturesEnabledValue ? 'dark' : 'light';
    }
  }
}
