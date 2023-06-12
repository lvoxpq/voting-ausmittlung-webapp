/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { MajorityElectionResult, MajorityElectionWriteInMapping, SecondaryMajorityElectionResult } from '../../models';
import { groupBySingle } from './array.utils';
import { MajorityElectionWriteInMappingTarget } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/majority_election_write_in_pb';

export function resetWriteIns(result: MajorityElectionResult | SecondaryMajorityElectionResult): void {
  const individualVoteCount = result.eVotingSubTotal.individualVoteCount;
  result.individualVoteCount -= individualVoteCount;
  result.eVotingSubTotal.individualVoteCount = 0;

  const invalidVoteCount = result.eVotingSubTotal.invalidVoteCount;
  result.invalidVoteCount -= invalidVoteCount;
  result.eVotingSubTotal.invalidVoteCount = 0;

  result.eVotingSubTotal.emptyVoteCountWriteIns = 0;
  for (const candidateResult of result.candidateResults) {
    candidateResult.eVotingWriteInsVoteCount = 0;
  }

  if ('countOfVoters' in result) {
    const invalidVoteCount = result.countOfVoters.eVotingInvalidBallots;
    result.countOfVoters.eVotingInvalidBallots = 0;
    result.countOfVoters.totalInvalidBallots -= invalidVoteCount;
    result.countOfVoters.eVotingAccountedBallots += invalidVoteCount;
    result.countOfVoters.totalAccountedBallots += invalidVoteCount;
  }
}

export function adjustWriteIns(
  result: MajorityElectionResult | SecondaryMajorityElectionResult,
  mappings: MajorityElectionWriteInMapping[],
): void {
  const candidateResultsByCandidateId = groupBySingle(
    result.candidateResults,
    x => x.candidate.id,
    x => x,
  );

  for (const mapping of mappings) {
    const voteCount = mapping.voteCount;
    switch (mapping.target) {
      case MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_INDIVIDUAL:
      case MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_UNSPECIFIED:
        result.eVotingSubTotal.individualVoteCount += voteCount;
        result.individualVoteCount += voteCount;
        break;
      case MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_INVALID:
        result.eVotingSubTotal.invalidVoteCount += voteCount;
        result.invalidVoteCount += voteCount;
        if ('countOfVoters' in result) {
          result.countOfVoters.eVotingInvalidBallots += voteCount;
          result.countOfVoters.totalInvalidBallots += voteCount;
          result.countOfVoters.eVotingAccountedBallots -= voteCount;
          result.countOfVoters.totalAccountedBallots -= voteCount;
        }
        break;
      case MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_EMPTY:
        result.eVotingSubTotal.emptyVoteCountWriteIns += voteCount;
        break;
      case MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_CANDIDATE:
        candidateResultsByCandidateId[mapping.candidateId].eVotingWriteInsVoteCount += voteCount;
        break;
      default:
        throw new Error('invalid mapping target');
    }
  }
}
