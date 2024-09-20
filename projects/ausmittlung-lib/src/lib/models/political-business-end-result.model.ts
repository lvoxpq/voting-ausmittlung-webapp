/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Contest } from './contest.model';
import { CountOfVotersInformation } from './count-of-voters.model';
import { VotingCardResultDetail } from './voting-cards.model';

export interface PoliticalBusinessEndResult {
  contest: Contest;
  countOfVotersInformation: CountOfVotersInformation;
  votingCards: VotingCardResultDetail[];
  countOfDoneCountingCircles: number;
  totalCountOfCountingCircles: number;
  allCountingCirclesDone: boolean;
  finalized: boolean;
}
