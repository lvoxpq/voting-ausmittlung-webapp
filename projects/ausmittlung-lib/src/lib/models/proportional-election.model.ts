/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  ProportionalElection as ProportionalElectionProto,
  ProportionalElectionCandidate as ProportionalElectionCandidateProto,
  ProportionalElectionList as ProportionalElectionListProto,
  ProportionalElectionListUnion as ProportionalElectionListUnionProto,
  ProportionalElectionMandateAlgorithm,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/proportional_election_pb';
import { Contest } from './contest.model';

export {
  ProportionalElectionProto,
  ProportionalElectionMandateAlgorithm,
  ProportionalElectionListProto,
  ProportionalElectionCandidateProto,
};

export interface ProportionalElection extends Omit<ProportionalElectionProto.AsObject, 'contest'> {
  contest?: Contest;
}

export type ProportionalElectionList = ProportionalElectionListProto.AsObject;

export type ProportionalElectionCandidate = ProportionalElectionCandidateProto.AsObject;
export type ProportionalElectionListUnion = ProportionalElectionListUnionProto.AsObject;
