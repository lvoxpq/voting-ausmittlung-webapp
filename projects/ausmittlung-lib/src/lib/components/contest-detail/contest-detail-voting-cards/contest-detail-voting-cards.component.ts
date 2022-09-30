/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Input, OnChanges } from '@angular/core';
import {
  AggregatedContestCountingCircleDetails,
  ContestCountingCircleDetails,
  DomainOfInfluenceType,
  VotingCardChannel,
  VotingCardResultDetail,
} from '../../../models';
import { groupBy } from '../../../services/utils/array.utils';

@Component({
  selector: 'vo-ausm-contest-detail-voting-cards',
  templateUrl: './contest-detail-voting-cards.component.html',
})
export class ContestDetailVotingCardsComponent implements OnChanges {
  public votingCardsByDoiType: { [key in keyof typeof DomainOfInfluenceType]?: VotingCardResultDetail[] } = {};

  @Input()
  public readonly: boolean = true;

  @Input()
  public domainOfInfluenceTypes: DomainOfInfluenceType[] = [];

  @Input()
  public enabledVotingCardChannels: VotingCardChannel[] = [];

  @Input()
  public details!: ContestCountingCircleDetails | AggregatedContestCountingCircleDetails;

  public ngOnChanges(): void {
    const vcByDoiType = groupBy(
      this.details.votingCards,
      x => x.domainOfInfluenceType,
      x => x,
    );

    const allVotingCards: VotingCardResultDetail[] = [];
    this.votingCardsByDoiType = {};
    for (const doiType of this.domainOfInfluenceTypes) {
      const byChannel = groupBy(
        vcByDoiType[doiType] ?? [],
        x => x.channel,
        x => x,
      );
      const vcDetails =
        this.enabledVotingCardChannels.length === 0
          ? this.details.votingCards.filter(x => !!x.countOfReceivedVotingCards && x.countOfReceivedVotingCards > 0)
          : this.enabledVotingCardChannels.map(c => ({
              countOfReceivedVotingCards: byChannel[c.votingChannel]?.find(x => x.valid === c.valid)?.countOfReceivedVotingCards,
              domainOfInfluenceType: doiType,
              valid: c.valid,
              channel: c.votingChannel,
            }));
      allVotingCards.push(...vcDetails);
      this.votingCardsByDoiType[doiType] = vcDetails;
    }

    this.details.votingCards = allVotingCards;
  }
}
