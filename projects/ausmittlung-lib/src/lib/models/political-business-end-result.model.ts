/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { AggregatedContestCountingCircleDetails } from './contest-counting-circle-details.model';
import { Contest } from './contest.model';

export interface PoliticalBusinessEndResult {
  contest: Contest;
  domainOfInfluenceDetails?: AggregatedContestCountingCircleDetails;
  totalCountOfVoters: number;
  countOfDoneCountingCircles: number;
  totalCountOfCountingCircles: number;
  allCountingCirclesDone: boolean;
  finalized: boolean;
}
