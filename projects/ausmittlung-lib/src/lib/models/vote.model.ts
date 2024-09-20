/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  Ballot as BallotProto,
  BallotQuestion as BallotQuestionProto,
  BallotType as BallotTypeProto,
  TieBreakQuestion as TieBreakQuestionProto,
  Vote as VoteProto,
  VoteResultAlgorithm,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/vote_pb';
import { Contest } from './contest.model';

export { VoteProto, BallotQuestionProto, TieBreakQuestionProto, BallotTypeProto, VoteResultAlgorithm };
export interface Vote extends Omit<VoteProto.AsObject, 'contest'> {
  contest?: Contest;
}

export type Ballot = BallotProto.AsObject;
export type BallotQuestion = BallotQuestionProto.AsObject;
export type TieBreakQuestion = TieBreakQuestionProto.AsObject;
