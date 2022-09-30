/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  MajorityElectionCandidateEndResult as MajorityElectionCandidateEndResultProto,
  MajorityElectionCandidateEndResultState as MajorityElectionCandidateEndResultStateProto,
  MajorityElectionEndResult as MajorityElectionEndResultProto,
  MajorityElectionEndResultAvailableLotDecision as MajorityElectionEndResultAvailableLotDecisionProto,
  MajorityElectionEndResultAvailableLotDecisions as MajorityElectionEndResultAvailableLotDecisionsProto,
  MajorityElectionEndResultLotDecision as MajorityElectionEndResultLotDecisionProto,
  SecondaryMajorityElectionEndResult as SecondaryMajorityElectionEndResultProto,
  SecondaryMajorityElectionEndResultAvailableLotDecisions as SecondaryMajorityElectionEndResultAvailableLotDecisionsProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/majority_election_end_result_pb';
import { PoliticalBusinessCountOfVoters } from './count-of-voters.model';
import { ElectionEndResultAvailableLotDecision } from './election-lot-decision.model';
import { MajorityElectionResultSubTotal } from './majority-election-result.model';
import { MajorityElection, MajorityElectionCandidate, SecondaryMajorityElection } from './majority-election.model';
import { PoliticalBusinessEndResult } from './political-business-end-result.model';

export {
  MajorityElectionEndResultProto,
  SecondaryMajorityElectionEndResultProto,
  MajorityElectionCandidateEndResultProto,
  MajorityElectionEndResultLotDecisionProto,
  MajorityElectionEndResultAvailableLotDecisionProto,
  SecondaryMajorityElectionEndResultAvailableLotDecisionsProto,
  MajorityElectionEndResultAvailableLotDecisionsProto,
};

export { MajorityElectionCandidateEndResultStateProto as MajorityElectionCandidateEndResultState };

export interface MajorityElectionEndResult extends PoliticalBusinessEndResult, MajorityElectionResultSubTotal {
  election: MajorityElection;
  countOfVoters: PoliticalBusinessCountOfVoters;
  candidateEndResults: MajorityElectionCandidateEndResult[];
  secondaryMajorityElectionEndResults: SecondaryMajorityElectionEndResult[];
  eVotingSubTotal: MajorityElectionResultSubTotal;
  conventionalSubTotal: MajorityElectionResultSubTotal;
}

export interface SecondaryMajorityElectionEndResult extends MajorityElectionResultSubTotal {
  election: SecondaryMajorityElection;
  candidateEndResults: MajorityElectionCandidateEndResult[];
  eVotingSubTotal: MajorityElectionResultSubTotal;
  conventionalSubTotal: MajorityElectionResultSubTotal;
}

export interface MajorityElectionCandidateEndResult {
  candidate: MajorityElectionCandidate;
  voteCount: number;
  eVotingVoteCount: number;
  conventionalVoteCount: number;
  rank: number;
  lotDecision: boolean;
  lotDecisionEnabled: boolean;
  lotDecisionRequired: boolean;
  state?: MajorityElectionCandidateEndResultStateProto;
}

export interface MajorityElectionEndResultLotDecision {
  candidateId: string;
  rank: number;
}

export interface MajorityElectionEndResultAvailableLotDecisions {
  election: MajorityElection;
  lotDecisions: MajorityElectionEndResultAvailableLotDecision[];
  secondaryLotDecisions: SecondaryMajorityElectionEndResultAvailableLotDecisions[];
}

export interface SecondaryMajorityElectionEndResultAvailableLotDecisions {
  election: SecondaryMajorityElection;
  lotDecisions: MajorityElectionEndResultAvailableLotDecision[];
}

export interface MajorityElectionEndResultAvailableLotDecision extends ElectionEndResultAvailableLotDecision {
  candidate: MajorityElectionCandidate;
}
