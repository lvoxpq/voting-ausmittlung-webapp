/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ProportionalElectionUnionEndResult as ProportionalElectionUnionEndResultProto } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/proportional_election_union_end_result_pb';
import { Contest } from './contest.model';
import { PoliticalBusinessUnion } from './political-business-union.model';
import { ProportionalElectionEndResult } from './proportional-election-end-result.model';

export { ProportionalElectionUnionEndResultProto };

export interface ProportionalElectionUnionEndResult {
  contest: Contest;
  proportionalElectionUnion: PoliticalBusinessUnion;
  proportionalElectionEndResults: ProportionalElectionEndResult[];
  countOfDoneElections: number;
  totalCountOfElections: number;
  allElectionsDone: boolean;
  finalized: boolean;
}
