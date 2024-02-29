/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnDestroy } from '@angular/core';
import { Contest, CountOfVotersInformation, DomainOfInfluenceType, VotingCardResultDetail } from 'ausmittlung-lib';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomainOfInfluenceCanton } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/domain_of_influence_pb';

@Component({
  selector: 'app-end-result-page',
  templateUrl: './end-result-page.component.html',
})
export class EndResultPageComponent implements OnDestroy {
  @Input()
  public loading: boolean = false;

  @Input()
  public contest?: Contest;

  @Input()
  public swissAbroadHaveVotingRights: boolean = false;

  @Input()
  public countOfVotersInformation?: CountOfVotersInformation;

  @Input()
  public votingCards?: VotingCardResultDetail[];

  @Input()
  public domainOfInfluenceType?: DomainOfInfluenceType;

  @Input()
  public canton?: DomainOfInfluenceCanton;

  public newZhFeaturesEnabled: boolean = false;

  private readonly routeDataSubscription: Subscription;

  constructor(route: ActivatedRoute) {
    this.routeDataSubscription = route.data.subscribe(async ({ contestCantonDefaults }) => {
      this.newZhFeaturesEnabled = contestCantonDefaults.newZhFeaturesEnabled;
    });
  }

  public async ngOnDestroy(): Promise<void> {
    this.routeDataSubscription.unsubscribe();
  }
}
