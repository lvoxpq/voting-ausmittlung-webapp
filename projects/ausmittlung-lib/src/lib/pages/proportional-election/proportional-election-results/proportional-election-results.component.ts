/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  dataSourceToPropertyPrefix,
  ProportionalElectionListResult,
  ProportionalElectionResult,
  ResultList,
  VotingDataSource,
} from '../../../models';
import { BreadcrumbItem, BreadcrumbsService } from '../../../services/breadcrumbs.service';
import { ProportionalElectionResultService } from '../../../services/proportional-election-result.service';
import { ResultService } from '../../../services/result.service';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'vo-ausm-proportional-election-results',
  templateUrl: './proportional-election-results.component.html',
  styleUrls: ['./proportional-election-results.component.scss'],
})
export class ProportionalElectionResultsComponent implements OnDestroy {
  public readonly listResultColumns = [
    'orderNumber',
    'description',
    'unmodifiedListVotesCount',
    'unmodifiedListBlankRowsCount',
    'modifiedListVotesCount',
    'modifiedListBlankRowsCount',
    'unmodifiedListsCount',
    'modifiedListsCount',
  ];
  public readonly candidateColumns = [
    'number',
    'lastName',
    'firstName',
    'unmodifiedListVotesCount',
    'modifiedListVotesCount',
    'countOfVotesOnOtherLists',
    'countOfVotesFromAccumulations',
    'voteCount',
  ];

  public dataPrefix?: string;

  public contestResultList?: ResultList;
  public electionResult?: ProportionalElectionResult;
  public listResults: ProportionalElectionListResult[] = [];
  public selectedListResult?: ProportionalElectionListResult;
  public loading: boolean = true;

  public breadcrumbs: BreadcrumbItem[];

  private readonly routeParamsSubscription: Subscription;

  constructor(
    roleService: RoleService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly route: ActivatedRoute,
    private readonly resultService: ResultService,
    private readonly proportionalElectionResultService: ProportionalElectionResultService,
  ) {
    this.breadcrumbs = breadcrumbsService.forProportionalElectionResults();
    this.routeParamsSubscription = route.params.subscribe(({ resultId }) => this.loadData(resultId));
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
  }

  public selectListResult(listResult: ProportionalElectionListResult): void {
    this.selectedListResult = listResult;
  }

  public setDataPrefix(dataSource: VotingDataSource): void {
    this.dataPrefix = dataSourceToPropertyPrefix(dataSource);
  }

  private async loadData(resultId: string): Promise<void> {
    this.loading = true;
    try {
      this.electionResult = await this.proportionalElectionResultService.getByResultId(resultId);
      this.contestResultList = await this.resultService.getList(
        this.electionResult.election.contestId,
        this.electionResult.countingCircleId,
      );
      this.listResults = await this.proportionalElectionResultService.getListResults(resultId);
      this.breadcrumbs = this.breadcrumbsService.forProportionalElectionResults(this.electionResult);
    } finally {
      this.loading = false;
    }
  }
}
