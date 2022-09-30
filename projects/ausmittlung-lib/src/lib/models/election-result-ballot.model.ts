/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { PoliticalBusinessResultBallot } from './ballot-bundle.model';

export interface ElectionResultBallot extends PoliticalBusinessResultBallot {
  emptyVoteCount: number;
}
