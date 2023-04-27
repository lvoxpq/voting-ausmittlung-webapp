/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountingCircle,
  CountingCircleResultState,
  distinct,
  DomainOfInfluenceType,
  flatten,
  groupBy,
  groupBySingle,
  ResultOverview,
  ResultOverviewCountingCircleResult,
  ResultOverviewCountingCircleResults,
  ResultService,
  SimplePoliticalBusiness,
} from 'ausmittlung-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-monitoring-cockpit-grid',
  templateUrl: './monitoring-cockpit-grid.component.html',
  styleUrls: ['./monitoring-cockpit-grid.component.scss'],
})
export class MonitoringCockpitGridComponent implements OnInit, OnDestroy {
  public domainOfInfluenceTypeFilter?: DomainOfInfluenceType;
  public politicalBusinessFilter?: SimplePoliticalBusiness;
  public countingCircleFilter?: CountingCircle;
  public onlyCorrected: boolean = false;
  public showDetails: boolean = false;
  public plausibiliseLoading: boolean = false;

  public gridTemplateColumns: string = '';
  public readOnly: boolean = true;

  public filteredDomainOfInfluenceTypes: DomainOfInfluenceType[] = [];
  public filteredPoliticalBusinessesByDoiType: Record<number, SimplePoliticalBusiness[]> = [];
  public filteredPoliticalBusinesses: SimplePoliticalBusiness[] = [];
  public filteredCountingCircleResults: FilteredCountingCircleResults[] = [];

  public countingCircles: CountingCircle[] = [];
  public countingCircleResults: FilteredCountingCircleResults[] = [];

  public selectedTabIndex: number = 0;
  public countCorrected: number = 0;
  public countNotCorrected: number = 0;

  private politicalBusinesses: SimplePoliticalBusiness[] = [];
  private readonly tabCheckedStates: CountingCircleResultState[] = [
    CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_AUDITED_TENTATIVELY,
    CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_PLAUSIBILISED,
  ];

  private resultsById: Record<
    string,
    { result: ResultOverviewCountingCircleResult; countingCircleResults: FilteredCountingCircleResults }
  > = {};

  private contestId: string = '';

  private stateChangesSubscription?: Subscription;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute, private readonly resultService: ResultService) {}

  @Input()
  public set resultOverview(ro: ResultOverview) {
    this.stateChangesSubscription?.unsubscribe();

    this.contestId = ro.contest.id;
    this.readOnly = ro.contest.locked;
    this.politicalBusinesses = ro.politicalBusinesses;
    this.countingCircleResults = ro.countingCircleResults.sort(this.countingCircleResultsComparer).map(x => ({
      ...x,
      minResultState: this.getMinResultState(x),
      isCorrected: false,
      filteredResults: x.results,
      resultsByPoliticalBusinessId: groupBySingle(
        x.results,
        y => y.politicalBusinessId,
        y => y,
      ),
    }));
    this.resultsById = groupBySingle(
      flatten(this.countingCircleResults.map(r => r.results.map(x => ({ result: x, countingCircleResults: r })))),
      x => x.result.id,
      x => x,
    );

    this.countingCircles = this.countingCircleResults.map(x => x.countingCircle!);

    if (ro.contest.locked) {
      this.onlyCorrected = true;
    }

    this.updateFilters();

    if (this.countNotCorrected === 0) {
      this.onlyCorrectedFilterSelected(true);
    }

    this.startChangesListener();
  }

  public ngOnInit(): void {
    this.startChangesListener();
  }

  public ngOnDestroy(): void {
    this.stateChangesSubscription?.unsubscribe();
  }

  public domainOfInfluenceTypeFilterClicked(value: DomainOfInfluenceType): void {
    if (this.politicalBusinessFilter) {
      this.politicalBusinessFilter = undefined;
      this.updateFilters();
      return;
    }

    if (this.domainOfInfluenceTypeFilter === value) {
      this.domainOfInfluenceTypeFilter = undefined;
      this.updateFilters();
      return;
    }

    this.domainOfInfluenceTypeFilter = value;
    this.updateFilters();
  }

  public politicalBusinessFilterClicked(politicalBusiness: any, type: DomainOfInfluenceType): void {
    if (politicalBusiness === this.politicalBusinessFilter) {
      this.domainOfInfluenceTypeFilter = undefined;
      this.politicalBusinessFilter = undefined;
      this.updateFilters();
      return;
    }

    this.domainOfInfluenceTypeFilter = type;
    this.politicalBusinessFilter = politicalBusiness;
    this.updateFilters();
  }

  public onlyCorrectedFilterSelected(onlyCorrected: boolean): void {
    this.onlyCorrected = onlyCorrected;
    this.countingCircleFilter = undefined;
    this.updateFilters();
  }

  public countingCircleFilterSelected(cc: CountingCircle | undefined): void {
    this.countingCircleFilter = cc;
    this.updateFilters();
  }

  public updateFilters(): void {
    this.updateFilteredPoliticalBusinesses();
    this.updateCountingCircleFilter();
    this.removeUnneededPoliticalBusiness();
    this.updatePoliticalBusinessFilterGroups();
    this.updateGrid();
    this.updateFilterTabs();
    this.showDetails = !!this.domainOfInfluenceTypeFilter || !!this.politicalBusinessFilter;
  }

  public async openDetail(countingCircle: CountingCircle, politicalBusiness?: SimplePoliticalBusiness): Promise<void> {
    await this.router.navigate([countingCircle.id], {
      relativeTo: this.route,
      queryParams: {
        politicalBusinessId: politicalBusiness?.id,
      },
    });
  }

  public setAllInSubmissionOrCorrection(): void {
    const statesToUpdate = [
      CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE,
      CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE,
    ];
    const resultsToUpdate = Object.values(this.resultsById).filter(({ result: { state } }) => statesToUpdate.includes(state));

    for (const {
      result: { id },
    } of resultsToUpdate) {
      this.updateState(id, CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION);
    }
  }

  private startChangesListener(): void {
    if (!this.contestId || !this.resultService || this.readOnly) {
      return;
    }

    this.stateChangesSubscription?.unsubscribe();
    this.stateChangesSubscription = this.resultService
      .getStateChanges(this.contestId)
      .subscribe(({ id, newState }) => this.updateState(id, newState));
  }

  private updateState(id: string, newState: CountingCircleResultState): void {
    const { result, countingCircleResults } = this.resultsById[id] || {};
    if (!result || result.state === newState) {
      return;
    }

    result.state = newState;
    countingCircleResults.minResultState = this.getMinResultState(countingCircleResults);
    if (newState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE) {
      result.submissionDoneTimestamp = new Date();
    }
    this.updateFilters();
  }

  private updateFilterTabs(): void {
    this.selectedTabIndex = this.onlyCorrected ? 1 : 0;
    this.countCorrected = this.countingCircleResults.filter(cc => cc.isCorrected).length;
    this.countNotCorrected = this.countingCircleResults.length - this.countCorrected;
  }

  private updateFilteredPoliticalBusinesses(): void {
    if (!this.domainOfInfluenceTypeFilter) {
      this.filteredPoliticalBusinesses = this.politicalBusinesses;
      return;
    }

    if (!this.politicalBusinessFilter) {
      this.filteredPoliticalBusinesses = this.politicalBusinesses.filter(
        x => x.domainOfInfluence!.type === this.domainOfInfluenceTypeFilter,
      );
    } else {
      this.filteredPoliticalBusinesses = [this.politicalBusinessFilter];
    }
  }

  private updateCountingCircleFilter(): void {
    this.filteredCountingCircleResults = this.countingCircleResults;

    if (this.countingCircleFilter) {
      this.filteredCountingCircleResults = this.filteredCountingCircleResults.filter(
        x => x.countingCircle?.id === this.countingCircleFilter?.id,
      );
    }

    for (const cc of this.filteredCountingCircleResults) {
      cc.filteredResults = this.filteredPoliticalBusinesses.map(pb => cc.resultsByPoliticalBusinessId[pb.id]).filter(r => !!r);
      cc.isCorrected = cc.filteredResults.every(y => this.tabCheckedStates.includes(y.state));
    }

    this.filteredCountingCircleResults = this.filteredCountingCircleResults.filter(x => x.filteredResults.length > 0);

    if (!!this.countingCircleFilter) {
      this.onlyCorrected = this.filteredCountingCircleResults[0].isCorrected;
      return;
    }

    this.filteredCountingCircleResults = this.filteredCountingCircleResults.filter(x => x.isCorrected === this.onlyCorrected);
  }

  private removeUnneededPoliticalBusiness(): void {
    const filteredPoliticalBusinessIds = new Set(
      flatten(this.filteredCountingCircleResults.map(cc => cc.filteredResults)).map(r => r.politicalBusinessId),
    );

    this.filteredPoliticalBusinesses = this.filteredPoliticalBusinesses.filter(pb => filteredPoliticalBusinessIds.has(pb.id));
  }

  private updatePoliticalBusinessFilterGroups(): void {
    this.filteredPoliticalBusinessesByDoiType = groupBy(
      this.filteredPoliticalBusinesses,
      pb => pb.domainOfInfluence?.type as number,
      pb => pb,
    );
    this.filteredDomainOfInfluenceTypes = distinct(
      this.filteredPoliticalBusinesses.map(x => x.domainOfInfluence!.type as DomainOfInfluenceType),
      x => x,
    );
  }

  private updateGrid(): void {
    const polBusinessColCount = Math.max(this.filteredPoliticalBusinesses.length, 1);
    // first two columns are the color box and the name of the counting circle
    this.gridTemplateColumns = `2rem min-content repeat(${polBusinessColCount}, minmax(0, ${polBusinessColCount === 1 ? '25rem' : '1fr'}))`;
  }

  private getMinResultState(ccResults: ResultOverviewCountingCircleResults): CountingCircleResultState {
    return Math.min(...ccResults.results.map(x => x.state as number)) as CountingCircleResultState;
  }

  private countingCircleResultsComparer(a: ResultOverviewCountingCircleResults, b: ResultOverviewCountingCircleResults): number {
    // 1. order criteria: descending ResultState.Done count
    const aCompletedCount = a.results.filter(
      x =>
        x.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE ||
        x.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE,
    ).length;
    const bCompletedCount = b.results.filter(
      x =>
        x.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE ||
        x.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE,
    ).length;

    if (aCompletedCount !== bCompletedCount) {
      return bCompletedCount - aCompletedCount;
    }

    // 2. order criteria: ascending by the latest done timestamp
    if (aCompletedCount > 0) {
      const aLatestTimestamp = a.results
        .filter(x => !!x.submissionDoneTimestamp)
        .map(x => x.submissionDoneTimestamp!)
        .reduce((x, y) => (x > y ? x : y))
        .getTime();
      const bLatestTimestamp = b.results
        .filter(x => !!x.submissionDoneTimestamp)
        .map(x => x.submissionDoneTimestamp!)
        .reduce((x, y) => (x > y ? x : y))
        .getTime();

      if (aLatestTimestamp !== bLatestTimestamp) {
        return aLatestTimestamp - bLatestTimestamp;
      }
    }

    // 3. order criteria: ascending by cc name
    return a.countingCircle!.name.localeCompare(b.countingCircle!.name);
  }
}

export interface FilteredCountingCircleResults extends ResultOverviewCountingCircleResults {
  minResultState: CountingCircleResultState;
  isCorrected: boolean;
  filteredResults: ResultOverviewCountingCircleResult[];
  resultsByPoliticalBusinessId: Record<string, ResultOverviewCountingCircleResult>;
}
