/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  dataSourceToPropertyPrefix,
  groupBySingle,
  ProportionalElectionCandidateEndResult,
  ProportionalElectionCandidateEndResultState,
  ProportionalElectionEndResult,
  ProportionalElectionEndResultLotDecision,
  ProportionalElectionListEndResult,
  ProportionalElectionResultService,
  SecondFactorTransactionService,
  sum,
  SwissAbroadVotingRight,
  VotingDataSource,
} from 'ausmittlung-lib';
import { Subscription } from 'rxjs';
import {
  ProportionalElectionLotDecisionDialogComponent,
  ProportionalElectionLotDecisionDialogData,
  ProportionalElectionLotDecisionDialogResult,
} from '../../components/proportional-election-lot-decision-dialog/proportional-election-lot-decision-dialog.component';
import {
  ProportionalElectionManualEndResultDialogComponent,
  ProportionalElectionManualEndResultDialogData,
  ProportionalElectionManualEndResultDialogResult,
} from '../../components/proportional-election-manual-end-result-dialog/proportional-election-manual-end-result-dialog.component';

@Component({
  selector: 'app-proportional-election-end-result',
  templateUrl: './proportional-election-end-result.component.html',
  styleUrls: ['./proportional-election-end-result.component.scss'],
})
export class ProportionalElectionEndResultComponent implements OnDestroy {
  public dataPrefix?: string;

  public loading: boolean = true;
  public finalizing: boolean = false;
  public endResult?: ProportionalElectionEndResult;
  public swissAbroadVotingRights: typeof SwissAbroadVotingRight = SwissAbroadVotingRight;
  public hasLotDecisions: boolean = false;
  public hasOpenRequiredLotDecisions: boolean = false;
  public selectedListEndResult?: ProportionalElectionListEndResult;
  public candidateEndResults: ProportionalElectionCandidateEndResult[] = [];
  public listColumns: string[] = [];
  public candidateColumns: string[] = [];

  private readonly routeSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly resultService: ProportionalElectionResultService,
    private readonly dialogService: DialogService,
    private readonly i18n: TranslateService,
    private readonly toast: SnackbarService,
    private readonly secondFactorTransactionService: SecondFactorTransactionService,
  ) {
    this.routeSubscription = this.route.params.subscribe(({ politicalBusinessId }) => this.loadData(politicalBusinessId));
  }

  public async ngOnDestroy(): Promise<void> {
    this.routeSubscription.unsubscribe();
  }

  public setDataPrefix(dataSource: VotingDataSource): void {
    this.dataPrefix = dataSourceToPropertyPrefix(dataSource);
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
          'END_RESULT.PROPORTIONAL_ELECTION.CONFIRM.TITLE',
          'END_RESULT.PROPORTIONAL_ELECTION.CONFIRM.MESSAGE',
          'APP.CONFIRM',
        );
        if (!confirmed) {
          this.endResult!.finalized = false;
          return;
        }

        const proportionalElectionId = this.endResult.election.id;
        const secondFactorTransaction = await this.resultService.prepareFinalizeEndResult(proportionalElectionId);

        await this.secondFactorTransactionService
          .showDialogAndExecuteVerifyAction(
            () => this.resultService.finalizeEndResult(proportionalElectionId, secondFactorTransaction.getId()),
            secondFactorTransaction.getCode(),
          )
          .catch(err => {
            this.endResult!.finalized = false;
            throw err;
          });
      } else {
        await this.resultService.revertEndResultFinalization(this.endResult.election.id);
        this.endResult.finalized = false;
      }
    } finally {
      this.finalizing = false;
      this.refreshTableColumns();
    }

    this.toast.success(this.i18n.instant('APP.SAVED'));
    this.endResult.finalized = finalize;
  }

  public async openUpdateLotDecisions(): Promise<void> {
    if (!this.endResult) {
      return;
    }

    const lists = this.endResult.listEndResults.filter(
      l => l.hasOpenRequiredLotDecisions || l.candidateEndResults.some(c => c.lotDecisionEnabled),
    );
    if (lists.length === 0) {
      return;
    }

    const data: ProportionalElectionLotDecisionDialogData = {
      lists,
    };

    const result = await this.dialogService.openForResult<
      ProportionalElectionLotDecisionDialogComponent,
      ProportionalElectionLotDecisionDialogResult
    >(ProportionalElectionLotDecisionDialogComponent, data);

    this.updateEndResultByLotDecisions(result?.lotDecisionsByListId);
  }

  public async openEnterManualEndResult(): Promise<void> {
    if (!this.endResult || this.endResult.listEndResults.length === 0) {
      return;
    }

    const data: ProportionalElectionManualEndResultDialogData = {
      lists: this.endResult.listEndResults,
    };

    const result = await this.dialogService.openForResult<
      ProportionalElectionManualEndResultDialogComponent,
      ProportionalElectionManualEndResultDialogResult
    >(ProportionalElectionManualEndResultDialogComponent, data);

    if (result?.hasChanges) {
      this.endResult.finalized = false;
    }

    for (const listEndResult of this.endResult.listEndResults) {
      listEndResult.numberOfMandates = listEndResult.candidateEndResults.filter(
        x => x.state === ProportionalElectionCandidateEndResultState.PROPORTIONAL_ELECTION_CANDIDATE_END_RESULT_STATE_ELECTED,
      ).length;
    }
  }

  public selectListEndResult(listEndResult: ProportionalElectionListEndResult): void {
    this.selectedListEndResult = listEndResult;
    this.candidateEndResults = this.selectedListEndResult.candidateEndResults;
  }

  private async loadData(proportionalElectionId: string): Promise<void> {
    this.loading = true;
    try {
      this.endResult = await this.resultService.getEndResult(proportionalElectionId);
      this.hasLotDecisions = this.endResult.listEndResults.some(le => le.candidateEndResults.some(x => x.lotDecisionEnabled));
      this.hasOpenRequiredLotDecisions = this.endResult.listEndResults.some(l => l.hasOpenRequiredLotDecisions);
      this.refreshTableColumns();
    } finally {
      this.loading = false;
    }

    if (this.hasOpenRequiredLotDecisions && this.endResult.allCountingCirclesDone && !this.endResult.contest.locked) {
      await this.openUpdateLotDecisions();
    }

    if (!this.endResult.manualEndResultRequired) {
      return;
    }

    const sumListNumberOfMandates = sum(this.endResult.listEndResults, x => x.numberOfMandates);
    if (sumListNumberOfMandates !== this.endResult.election.numberOfMandates) {
      await this.openEnterManualEndResult();
    }
  }

  private updateEndResultByLotDecisions(
    lotDecisionsByListId: Record<string, ProportionalElectionEndResultLotDecision[]> | undefined,
  ): void {
    if (!lotDecisionsByListId || !this.endResult) {
      return;
    }

    const listsById = groupBySingle(
      this.endResult.listEndResults,
      x => x.list.id,
      x => x,
    );
    for (const [listId, lotDecisions] of Object.entries(lotDecisionsByListId)) {
      const list = listsById[listId];
      const candidateEndResultsById = groupBySingle(
        list.candidateEndResults,
        x => x.candidate.id,
        x => x,
      );

      for (const lotDecision of lotDecisions) {
        const candidateEndResult = candidateEndResultsById[lotDecision.candidateId];
        candidateEndResult.lotDecision = true;
        candidateEndResult.rank = lotDecision.rank;
        candidateEndResult.state =
          lotDecision.rank <= list.numberOfMandates
            ? ProportionalElectionCandidateEndResultState.PROPORTIONAL_ELECTION_CANDIDATE_END_RESULT_STATE_ELECTED
            : ProportionalElectionCandidateEndResultState.PROPORTIONAL_ELECTION_CANDIDATE_END_RESULT_STATE_NOT_ELECTED;
      }

      list.candidateEndResults = list.candidateEndResults.sort((a, b) => a.rank - b.rank);
      list.hasOpenRequiredLotDecisions = false;

      if (list === this.selectedListEndResult) {
        this.candidateEndResults = [...this.selectedListEndResult.candidateEndResults];
      }
    }

    this.hasOpenRequiredLotDecisions = this.endResult.listEndResults.some(l => l.hasOpenRequiredLotDecisions);
    this.endResult.finalized = false;
  }

  private refreshTableColumns(): void {
    this.listColumns = ['orderNumber', 'description'];
    if (this.endResult?.finalized) {
      this.listColumns.push('listVotesCount', 'blankRowsCount', 'totalVoteCount');
      if (this.endResult?.allCountingCirclesDone) {
        this.listColumns.push('nrOfMandates');
      }
    }
    this.listColumns.push('listUnion', 'subListUnion');

    this.candidateColumns = ['number', 'lastName', 'firstName'];
    if (this.endResult?.finalized) {
      this.candidateColumns.push('voteCount');
      if (this.endResult?.finalized && this.endResult?.allCountingCirclesDone) {
        this.candidateColumns.push('rank');
      }
      this.candidateColumns.push('state');
      if (this.endResult?.allCountingCirclesDone && this.hasLotDecisions && !this.hasOpenRequiredLotDecisions) {
        this.candidateColumns.push('lotDecision');
      }
    }
  }
}
