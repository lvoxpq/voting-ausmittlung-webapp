/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingChannel } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/voting_channel_pb';

export { VotingChannel };

export interface VotingCardChannel {
  votingChannel: VotingChannel;
  valid: boolean;
}
