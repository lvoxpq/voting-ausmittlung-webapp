/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { CountingCircleResultState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';
import { DialogService, SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MajorityElectionBallotGroupResult, MajorityElectionBallotGroupResults } from '../../../models';
import { MajorityElectionResultService } from '../../../services/majority-election-result.service';
import { RoleService } from '../../../services/role.service';
import { sum } from '../../../services/utils/array.utils';

@Component({
  selector: 'vo-ausm-majority-election-ballot-groups',
  templateUrl: './majority-election-ballot-groups.component.html',
  styleUrls: ['./majority-election-ballot-groups.component.scss'],
})
export class MajorityElectionBallotGroupsComponent implements OnDestroy {
  public result?: MajorityElectionBallotGroupResults;
  public focusedBallotGroup?: MajorityElectionBallotGroupResult;
  public total: number = 0;
  public loading: boolean = true;
  public saving: boolean = false;
  public isErfassungElectionAdmin: Observable<boolean>;
  public canSave: boolean = false;
  public hasChanges: boolean = false;
  public resultReadOnly: boolean = false;

  private readonly routeParamsSubscription: Subscription;

  constructor(
    roleService: RoleService,
    private readonly i18n: TranslateService,
    private readonly toast: SnackbarService,
    private readonly dialog: DialogService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly resultService: MajorityElectionResultService,
    private readonly themeService: ThemeService,
  ) {
    this.isErfassungElectionAdmin = roleService.isErfassungElectionAdmin;
    this.routeParamsSubscription = route.params.subscribe(({ resultId }) => this.loadData(resultId));
  }

  public async back(): Promise<void> {
    if (!this.hasChanges) {
      await this.navigateToContestDetail();
      return;
    }

    if (
      await this.dialog.confirm(this.i18n.instant('APP.CHANGES.TITLE'), this.i18n.instant('APP.CHANGES.MSG'), this.i18n.instant('APP.NEXT'))
    ) {
      await this.navigateToContestDetail();
    }
  }

  public async save(): Promise<void> {
    if (!this.result) {
      return;
    }

    this.saving = true;
    try {
      await this.resultService.enterBallotGroupResults(this.result.electionResult.id, this.result.ballotGroupResults);
      this.toast.success(this.i18n.instant('APP.SAVED'));
      this.hasChanges = false;
      await this.navigateToContestDetail();
    } finally {
      this.saving = false;
    }
  }

  public updateTotalAndSetChanges(): void {
    if (!this.result) {
      return;
    }
    this.total = sum(this.result.ballotGroupResults, r => r.voteCount);
    this.canSave = this.result?.ballotGroupResults.every(x => x.voteCount >= 0) ?? false;
    this.hasChanges = true;
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
  }

  private async loadData(resultId: string): Promise<void> {
    this.loading = true;
    try {
      this.result = await this.resultService.getBallotGroups(resultId);
      this.resultReadOnly =
        this.result.electionResult.election.contest!.locked ||
        (this.result.electionResult.state !== CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION &&
          this.result.electionResult.state !== CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING);
      this.updateTotalAndSetChanges();
      this.hasChanges = false;
    } finally {
      this.loading = false;
    }
  }

  private async navigateToContestDetail(): Promise<void> {
    if (!this.result) {
      return;
    }

    await this.router.navigate(
      [
        this.themeService.theme$.value,
        'contests',
        this.result.electionResult.election.contestId,
        this.result.electionResult.countingCircleId,
      ],
      {
        queryParams: {
          politicalBusinessId: this.result.electionResult.election.id,
        },
      },
    );
  }
}
