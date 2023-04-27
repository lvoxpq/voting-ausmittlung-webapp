/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Input } from '@angular/core';
import { VotingCardResultDetail, CountOfVotersInformation, Contest, DomainOfInfluenceType } from 'ausmittlung-lib';

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
  public countOfVotersInformation?: CountOfVotersInformation;

  @Input()
  public votingCards?: VotingCardResultDetail;

  @Input()
  public domainOfInfluenceType?: DomainOfInfluenceType;
}
