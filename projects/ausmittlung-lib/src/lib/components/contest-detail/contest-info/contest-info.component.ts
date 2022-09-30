/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { CountingCircleResultState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';
import { PoliticalBusinessType } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/political_business_pb';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResultList } from '../../../models';
import { MajorityElectionResultService } from '../../../services/majority-election-result.service';
import { PoliticalBusinessResultService } from '../../../services/political-business-result.service';
import { ProportionalElectionResultService } from '../../../services/proportional-election-result.service';
import { groupBy } from '../../../services/utils/array.utils';
import { VoteResultService } from '../../../services/vote-result.service';

@Component({
  selector: 'vo-ausm-contest-info',
  templateUrl: './contest-info.component.html',
  styleUrls: ['./contest-info.component.scss'],
})
export class ContestInfoComponent implements OnDestroy, OnChanges {
  public readonly countingCircleResultStates: typeof CountingCircleResultState = CountingCircleResultState;

  @Input()
  public resultList!: ResultList;

  @Input()
  public showStateActions: boolean = false;

  public isActionExecuting: boolean = false;
  public canSetAllToAuditedTentatively: boolean = false;

  private readonly resultStateChangedSubscription: Subscription;

  constructor(
    private readonly voteResultService: VoteResultService,
    private readonly proportionalElectionResultService: ProportionalElectionResultService,
    private readonly majorityElectionResultService: MajorityElectionResultService,
    private readonly politicalBusinessResultService: PoliticalBusinessResultService,
  ) {
    this.resultStateChangedSubscription = politicalBusinessResultService.resultStateChanged$.subscribe(() =>
      this.updateCanSetAllToAuditedTentatively(),
    );
  }

  public ngOnChanges(): void {
    this.updateCanSetAllToAuditedTentatively();
  }

  public ngOnDestroy(): void {
    this.resultStateChangedSubscription.unsubscribe();
  }

  public async executeStateUpdate(newState: CountingCircleResultState): Promise<void> {
    const byBusinessType = groupBy(
      this.resultList.results,
      x => x.politicalBusiness.businessType,
      x => x.id,
    );

    if (newState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_AUDITED_TENTATIVELY) {
      await this.auditedTentatively(
        byBusinessType[PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_VOTE] || [],
        byBusinessType[PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_PROPORTIONAL_ELECTION] || [],
        byBusinessType[PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_MAJORITY_ELECTION] || [],
      );
    }

    for (const result of this.resultList.results) {
      result.state = newState;
      this.politicalBusinessResultService.resultStateChanged(result.id, newState);
    }
  }

  private async auditedTentatively(
    voteResultIds: string[],
    proportionalElectionResultIds: string[],
    majorityElectionResultIds: string[],
  ): Promise<void> {
    try {
      this.isActionExecuting = true;
      if (voteResultIds.length !== 0) {
        await this.voteResultService.auditedTentatively(voteResultIds);
      }

      if (proportionalElectionResultIds.length !== 0) {
        await this.proportionalElectionResultService.auditedTentatively(proportionalElectionResultIds);
      }

      if (majorityElectionResultIds.length !== 0) {
        await this.majorityElectionResultService.auditedTentatively(majorityElectionResultIds);
      }
    } finally {
      this.isActionExecuting = false;
    }
  }

  private updateCanSetAllToAuditedTentatively(): void {
    if (!this.resultList) {
      return;
    }

    this.canSetAllToAuditedTentatively = this.resultList.results.every(
      x =>
        x.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE ||
        x.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE,
    );
  }
}
