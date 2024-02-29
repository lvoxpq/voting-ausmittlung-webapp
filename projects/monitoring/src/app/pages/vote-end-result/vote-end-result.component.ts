/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SecondFactorTransactionService, SwissAbroadVotingRight, VoteEndResult, VoteResultService } from 'ausmittlung-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vote-end-result',
  templateUrl: './vote-end-result.component.html',
  styleUrls: ['./vote-end-result.component.scss'],
})
export class VoteEndResultComponent implements OnDestroy {
  public loading: boolean = true;
  public finalizing: boolean = false;
  public endResult?: VoteEndResult;
  public swissAbroadVotingRights: typeof SwissAbroadVotingRight = SwissAbroadVotingRight;

  private readonly routeSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly resultService: VoteResultService,
    private readonly i18n: TranslateService,
    private readonly toast: SnackbarService,
    private readonly dialog: DialogService,
    private readonly secondFactorTransactionService: SecondFactorTransactionService,
  ) {
    this.routeSubscription = this.route.params.subscribe(({ politicalBusinessId }) => this.loadData(politicalBusinessId));
  }

  public async ngOnDestroy(): Promise<void> {
    this.routeSubscription.unsubscribe();
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

        const confirmed = await this.dialog.confirm('VOTE_END_RESULT.CONFIRM.TITLE', 'VOTE_END_RESULT.CONFIRM.MESSAGE', 'APP.CONFIRM');
        if (!confirmed) {
          this.endResult!.finalized = false;
          return;
        }

        const voteId = this.endResult.vote.id;
        const secondFactorTransaction = await this.resultService.prepareFinalizeEndResult(voteId);

        await this.secondFactorTransactionService
          .showDialogAndExecuteVerifyAction(
            () => this.resultService.finalizeEndResult(voteId, secondFactorTransaction.getId()),
            secondFactorTransaction.getCode(),
          )
          .catch(err => {
            this.endResult!.finalized = false;
            throw err;
          });
      } else {
        await this.resultService.revertEndResultFinalization(this.endResult.vote.id);
      }
    } finally {
      this.finalizing = false;
    }

    this.toast.success(this.i18n.instant('APP.SAVED'));
    this.endResult.finalized = finalize;
  }

  private async loadData(voteId: string): Promise<void> {
    this.loading = true;
    try {
      this.endResult = await this.resultService.getEndResult(voteId);
    } finally {
      this.loading = false;
    }
  }
}
