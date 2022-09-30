/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  groupBySingle,
  MajorityElectionEndResult,
  MajorityElectionEndResultLotDecision,
  MajorityElectionResultService,
  SecondFactorTransactionService,
  SwissAbroadVotingRight,
} from 'ausmittlung-lib';
import { Subscription } from 'rxjs';
import {
  MajorityElectionLotDecisionDialogComponent,
  MajorityElectionLotDecisionDialogData,
  MajorityElectionLotDecisionDialogResult,
} from '../../components/majority-election-lot-decision-dialog/majority-election-lot-decision-dialog.component';

@Component({
  selector: 'app-majority-election-end-result',
  templateUrl: './majority-election-end-result.component.html',
  styleUrls: ['./majority-election-end-result.component.scss'],
})
export class MajorityElectionEndResultComponent implements OnDestroy {
  public loading: boolean = true;
  public finalizing: boolean = false;
  public endResult?: MajorityElectionEndResult;
  public swissAbroadVotingRights: typeof SwissAbroadVotingRight = SwissAbroadVotingRight;
  public hasLotDecisions: boolean = false;
  public hasOpenRequiredLotDecisions: boolean = false;

  private readonly routeSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly resultService: MajorityElectionResultService,
    private readonly dialogService: DialogService,
    private readonly i18n: TranslateService,
    private readonly toast: SnackbarService,
    private readonly secondFactorTransactionService: SecondFactorTransactionService,
  ) {
    this.routeSubscription = this.route.params.subscribe(({ majorityElectionId }) => this.loadData(majorityElectionId));
  }

  public async ngOnDestroy(): Promise<void> {
    this.routeSubscription.unsubscribe();
  }

  public export(): void {
    alert('not yet implemented');
  }

  public async setFinalized(finalize: boolean): Promise<void> {
    if (!this.endResult || finalize === this.endResult.finalized) {
      return;
    }

    try {
      this.finalizing = true;

      if (finalize) {
        // This is necessary to force the "bc-radio-button-group" component to update the value back to its previous value
        // if an error occurs or the action is cancelled.
        this.endResult.finalized = true;

        const confirmed = await this.dialogService.confirm(
          'END_RESULT.MAJORITY_ELECTION.CONFIRM.TITLE',
          'END_RESULT.MAJORITY_ELECTION.CONFIRM.MESSAGE',
          'APP.CONFIRM',
        );
        if (!confirmed) {
          this.endResult!.finalized = false;
          return;
        }

        const majorityElectionId = this.endResult.election.id;
        const secondFactorTransaction = await this.resultService.prepareFinalizeEndResult(majorityElectionId);

        await this.secondFactorTransactionService
          .showDialogAndExecuteVerifyAction(
            () => this.resultService.finalizeEndResult(majorityElectionId, secondFactorTransaction.getId()),
            secondFactorTransaction.getCode(),
          )
          .catch(err => {
            this.endResult!.finalized = false;
            throw err;
          });
      } else {
        await this.resultService.revertEndResultFinalization(this.endResult.election.id);
      }
    } finally {
      this.finalizing = false;
    }

    this.toast.success(this.i18n.instant('APP.SAVED'));
    this.endResult.finalized = finalize;
  }

  public async openUpdateLotDecisions(): Promise<void> {
    if (!this.endResult) {
      return;
    }

    const data: MajorityElectionLotDecisionDialogData = {
      majorityElectionId: this.endResult.election.id,
    };

    const result = await this.dialogService.openForResult<
      MajorityElectionLotDecisionDialogComponent,
      MajorityElectionLotDecisionDialogResult
    >(MajorityElectionLotDecisionDialogComponent, data);

    this.updateEndResultByLotDecisions(result?.lotDecisions);
  }

  private async loadData(majorityElectionId: string): Promise<void> {
    this.loading = true;
    try {
      this.endResult = await this.resultService.getEndResult(majorityElectionId);

      const secondaryCandidateEndResults = Array.prototype.concat.apply(
        [],
        this.endResult.secondaryMajorityElectionEndResults.map(x => x.candidateEndResults),
      );

      this.hasLotDecisions =
        !!this.endResult.candidateEndResults.find(x => x.lotDecisionEnabled) ||
        !!secondaryCandidateEndResults.find(x => x.lotDecisionEnabled);
      this.hasOpenRequiredLotDecisions =
        !!this.endResult.candidateEndResults.find(x => x.lotDecisionRequired && !x.lotDecision) ||
        !!secondaryCandidateEndResults.find(x => x.lotDecisionRequired && !x.lotDecision);
    } finally {
      this.loading = false;
    }
  }

  private updateEndResultByLotDecisions(lotDecisions: MajorityElectionEndResultLotDecision[] | undefined): void {
    if (!lotDecisions || !this.endResult) {
      return;
    }

    let candidateEndResultsById = groupBySingle(
      this.endResult.candidateEndResults,
      x => x.candidate.id,
      x => x,
    );
    for (const secondaryMajorityElectionEndResult of this.endResult.secondaryMajorityElectionEndResults) {
      candidateEndResultsById = {
        ...candidateEndResultsById,
        ...groupBySingle(
          secondaryMajorityElectionEndResult.candidateEndResults,
          x => x.candidate.id,
          x => x,
        ),
      };
    }

    for (const lotDecision of lotDecisions) {
      const candidateEndResult = candidateEndResultsById[lotDecision.candidateId];
      candidateEndResult.lotDecision = true;
      candidateEndResult.rank = lotDecision.rank;
    }

    this.endResult.candidateEndResults = this.endResult.candidateEndResults.sort((a, b) => a.rank - b.rank);
    for (const secondaryMajorityElectionEndResult of this.endResult.secondaryMajorityElectionEndResults) {
      secondaryMajorityElectionEndResult.candidateEndResults = secondaryMajorityElectionEndResult.candidateEndResults.sort(
        (a, b) => a.rank - b.rank,
      );
    }

    this.hasOpenRequiredLotDecisions = false;
    this.endResult.finalized = false;
  }
}
