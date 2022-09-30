/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
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
