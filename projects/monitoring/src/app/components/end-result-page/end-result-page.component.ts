/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AggregatedContestCountingCircleDetails, Contest, DomainOfInfluenceType } from 'ausmittlung-lib';

@Component({
  selector: 'app-end-result-page',
  templateUrl: './end-result-page.component.html',
})
export class EndResultPageComponent {
  @Input()
  public loading: boolean = false;

  @Input()
  public contest?: Contest;

  @Input()
  public swissAbroadHaveVotingRights: boolean = false;

  @Input()
  public domainOfInfluenceDetails?: AggregatedContestCountingCircleDetails;

  @Input()
  public domainOfInfluenceType?: DomainOfInfluenceType;
}
