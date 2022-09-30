/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SimplePoliticalBusiness } from '../../../../models';

@Component({
  selector: 'vo-ausm-contest-proportional-election-detail-header',
  templateUrl: './contest-proportional-election-detail-header.component.html',
  styleUrls: ['./contest-proportional-election-detail-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestProportionalElectionDetailHeaderComponent {
  @Input()
  public election!: SimplePoliticalBusiness;
}
