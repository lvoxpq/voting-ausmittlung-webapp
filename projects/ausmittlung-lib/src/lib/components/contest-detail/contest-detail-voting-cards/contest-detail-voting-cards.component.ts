/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomainOfInfluenceType, VotingCardChannel, VotingCardResultDetail } from '../../../models';
import { groupBy } from '../../../services/utils/array.utils';

@Component({
  selector: 'vo-ausm-contest-detail-voting-cards',
  templateUrl: './contest-detail-voting-cards.component.html',
})
export class ContestDetailVotingCardsComponent implements OnInit {
  public votingCardsByDoiType: { [key in keyof typeof DomainOfInfluenceType]?: VotingCardResultDetail[] } = {};

  private _domainOfInfluenceTypes?: DomainOfInfluenceType[];
  private _enabledVotingCardChannels: VotingCardChannel[] = [];
  private _votingCards?: VotingCardResultDetail[];
  private initialized: boolean = false;

  @Input()
  public readonly: boolean = true;

  @Output()
  public votingCardsChange: EventEmitter<VotingCardResultDetail[]> = new EventEmitter<VotingCardResultDetail[]>();

  @Input()
  public set domainOfInfluenceTypes(v: DomainOfInfluenceType[]) {
    if (v === this._domainOfInfluenceTypes) {
      return;
    }

    this._domainOfInfluenceTypes = v;
    this.updateVotingCards();
  }

  public get domainOfInfluenceTypes(): DomainOfInfluenceType[] {
    return this._domainOfInfluenceTypes ?? [];
  }

  @Input()
  public set enabledVotingCardChannels(v: VotingCardChannel[]) {
    if (v === this._enabledVotingCardChannels) {
      return;
    }

    this._enabledVotingCardChannels = v;
    this.updateVotingCards();
  }

  @Input()
  public set votingCards(v: VotingCardResultDetail[]) {
    if (v === this._votingCards) {
      return;
    }

    this._votingCards = v;
    this.updateVotingCards();
  }

  public ngOnInit(): void {
    this.initialized = true;
    this.updateVotingCards();
  }

  public updateVotingCards(): void {
    if (!this.initialized || !this._votingCards || !this._domainOfInfluenceTypes) return;

    const vcByDoiType = groupBy(
      this._votingCards,
      x => x.domainOfInfluenceType,
      x => x,
    );

    const allVotingCards: VotingCardResultDetail[] = [];
    this.votingCardsByDoiType = {};
    for (const doiType of this._domainOfInfluenceTypes) {
      const byChannel = groupBy(
        vcByDoiType[doiType] ?? [],
        x => x.channel,
        x => x,
      );
      const vcDetails =
        this._enabledVotingCardChannels.length === 0
          ? this._votingCards
          : this._enabledVotingCardChannels.map(c => ({
              countOfReceivedVotingCards: byChannel[c.votingChannel]?.find(x => x.valid === c.valid)?.countOfReceivedVotingCards,
              domainOfInfluenceType: doiType,
              valid: c.valid,
              channel: c.votingChannel,
            }));
      allVotingCards.push(...vcDetails);
      this.votingCardsByDoiType[doiType] = vcDetails;
    }

    if (!this.readonly) {
      this._votingCards = allVotingCards;
      this.votingCardsChange.emit(allVotingCards);
    }
  }
}
