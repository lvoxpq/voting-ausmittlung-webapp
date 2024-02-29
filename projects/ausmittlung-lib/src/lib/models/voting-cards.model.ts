/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardResultDetail as VotingCardResultDetailProto } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/voting_cards_pb';
import { DomainOfInfluenceType, VotingChannel } from '.';

export { VotingCardResultDetailProto };

export interface VotingCardResultDetail {
  countOfReceivedVotingCards?: number;
  valid: boolean;
  channel: VotingChannel;
  domainOfInfluenceType: DomainOfInfluenceType;
}

export interface ElectorateVotingCardResultDetail {
  countOfReceivedVotingCards?: number;
  valid: boolean;
  channel: VotingChannel;
  domainOfInfluenceTypes: DomainOfInfluenceType[];
}
