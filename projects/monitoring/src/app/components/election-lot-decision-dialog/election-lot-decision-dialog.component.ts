/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService } from '@abraxas/voting-lib';
import { ElectionEndResultAvailableLotDecision } from 'ausmittlung-lib';

export abstract class ElectionLotDecisionDialogComponent<
  T extends ElectionEndResultAvailableLotDecision = ElectionEndResultAvailableLotDecision,
> {
  protected constructor(protected readonly dialog: DialogService) {}

  protected hasOpenRequiredLotDecisions(lotDecisions: T[]): boolean {
    return lotDecisions.some(lotDecision => !lotDecision.selectedRank && lotDecision.lotDecisionRequired);
  }

  protected hasUniqueLotDecisions(lotDecisions: T[]): boolean {
    const ranks: Set<number> = new Set<number>();

    for (const lotDecision of lotDecisions) {
      if (!lotDecision.selectedRank) {
        continue;
      }

      if (ranks.has(lotDecision.selectedRank)) {
        return false;
      }
      ranks.add(lotDecision.selectedRank);
    }
    return true;
  }

  protected alertMissingRequiredLotDecisions(): void {
    this.dialog.alert(
      'END_RESULT.ELECTION.LOT_DECISION.REQUIRED_IS_MISSING.TITLE',
      'END_RESULT.ELECTION.LOT_DECISION.REQUIRED_IS_MISSING.MSG',
      'COMMON.CANCEL',
    );
  }

  protected alertDuplicateLotDecisions(): void {
    this.dialog.alert(
      'END_RESULT.ELECTION.LOT_DECISION.DUPLICATE_RANK.TITLE',
      'END_RESULT.ELECTION.LOT_DECISION.DUPLICATE_RANK.MSG',
      'COMMON.CANCEL',
    );
  }
}
