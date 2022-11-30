/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DomainOfInfluenceType } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/domain_of_influence_pb';
import { Component, Input } from '@angular/core';
import { VotingCardResultDetail, VotingChannel } from '../../../models';
import { sum } from '../../../services/utils/array.utils';

@Component({
  selector: 'vo-ausm-contest-detail-voting-cards-doi-type',
  templateUrl: './contest-detail-voting-cards-doi-type.component.html',
  styleUrls: ['./contest-detail-voting-cards-doi-type.component.scss'],
})
export class ContestDetailVotingCardsDoiTypeComponent {
  public readonly votingChannels: typeof VotingChannel = VotingChannel;

  @Input()
  public readonly: boolean = true;

  @Input()
  public doiType!: DomainOfInfluenceType;

  public total: number = 0;
  public totalValid: number = 0;
  public hasInvalidVotingCardChannel: boolean = false;
  public votingCardDetailsValue: VotingCardResultDetail[] = [];

  @Input()
  public set votingCardDetails(votingCardDetails: VotingCardResultDetail[]) {
    this.votingCardDetailsValue = votingCardDetails;
    this.hasInvalidVotingCardChannel = this.votingCardDetailsValue.some(x => !x.valid);
    this.updateTotals();
  }

  public update(detail: VotingCardResultDetail, value?: number): void {
    detail.countOfReceivedVotingCards = value;
    this.updateTotals();
  }

  private updateTotals(): void {
    this.total = sum(this.votingCardDetailsValue, x => x.countOfReceivedVotingCards ?? 0);
    this.totalValid = sum(
      this.votingCardDetailsValue.filter(x => x.valid),
      x => x.countOfReceivedVotingCards ?? 0,
    );
  }
}
