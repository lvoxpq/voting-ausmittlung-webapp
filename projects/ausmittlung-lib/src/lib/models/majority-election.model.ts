/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  MajorityElection as MajorityElectionProto,
  MajorityElectionBallotGroup as MajorityElectionBallotGroupProto,
  MajorityElectionBallotGroupEntry as MajorityElectionBallotGroupEntryProto,
  MajorityElectionCandidate as MajorityElectionCandidateProto,
  MajorityElectionCandidates as MajorityElectionCandidatesProto,
  MajorityElectionMandateAlgorithm,
  SecondaryMajorityElection as SecondaryMajorityElectionProto,
  SecondaryMajorityElectionCandidates as SecondaryMajorityElectionCandidatesProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/majority_election_pb';
import { Contest } from './contest.model';

export {
  MajorityElectionProto,
  SecondaryMajorityElectionProto,
  MajorityElectionMandateAlgorithm,
  MajorityElectionCandidatesProto,
  SecondaryMajorityElectionCandidatesProto,
  MajorityElectionBallotGroupProto,
  MajorityElectionBallotGroupEntryProto,
};

export interface MajorityElection extends Omit<MajorityElectionProto.AsObject, 'contest'> {
  contest?: Contest;
}

export type SecondaryMajorityElection = SecondaryMajorityElectionProto.AsObject;
export type MajorityElectionBase = MajorityElection | SecondaryMajorityElection;

export type MajorityElectionCandidate = MajorityElectionCandidateProto.AsObject;

export interface MajorityElectionCandidates {
  candidates: MajorityElectionCandidate[];
  secondaryElectionCandidates: SecondaryMajorityElectionCandidates[];
}

export interface SecondaryMajorityElectionCandidates {
  secondaryMajorityElectionId: string;
  candidates: MajorityElectionCandidate[];
}

export interface MajorityElectionBallotGroup {
  id: string;
  majorityElectionId: string;
  shortDescription: string;
  description: string;
  position: number;
  entries: MajorityElectionBallotGroupEntry[];
}

export interface MajorityElectionBallotGroupEntry {
  election: MajorityElection | SecondaryMajorityElection;
  candidates: MajorityElectionCandidate[];
  hasIndividualCandidate: boolean;
}
