/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  Contest as ContestProto,
  ContestState,
  ContestSummary as ContestSummaryProto,
  ContestSummaryEntryDetails as ContestSummaryEntryDetailsProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/contest_pb';
import { SwissAbroadVotingRight as SwissAbroadVotingRightProto } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/swiss_abroad_voting_right_pb';

export { ContestState };
export { ContestProto };
export type Contest = {
  id: string;
  date?: Date;
  description: string;
  endOfTestingPhase?: Date;
  testingPhaseEnded: boolean;
  domainOfInfluenceId: string;
  eVoting: boolean;
  eVotingResultsImported: boolean;
  eVotingFrom?: Date;
  eVotingTo?: Date;
  state: ContestState;
  locked: boolean;
};
export { ContestSummaryProto };
export type ContestSummary = Contest & {
  contestEntriesDetails: ContestSummaryEntryDetails[];
};
export type ContestSummaryEntryDetails = ContestSummaryEntryDetailsProto.AsObject;
export { SwissAbroadVotingRightProto as SwissAbroadVotingRight };
