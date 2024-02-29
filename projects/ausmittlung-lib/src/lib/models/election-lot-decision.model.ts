/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export interface ElectionEndResultAvailableLotDecision {
  selectedRank?: number;
  voteCount: number;
  lotDecisionRequired: boolean;
  selectableRanks: number[];
  originalRank: number;
}
