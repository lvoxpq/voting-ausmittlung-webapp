/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { AuthorizationService, Tenant } from '@abraxas/base-components';
import { PoliticalBusinessType } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/political_business_pb';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CountingCircleResultState, SimplePoliticalBusiness } from 'ausmittlung-lib';
import { FilteredCountingCircleResults } from '../../monitoring-cockpit-grid/monitoring-cockpit-grid.component';
import { ThemeService } from '@abraxas/voting-lib';

@Component({
  selector: 'app-monitoring-cockpit-grid-footer-buttons',
  templateUrl: './monitoring-cockpit-grid-footer-buttons.component.html',
  styleUrls: ['./monitoring-cockpit-grid-footer-buttons.component.scss'],
})
export class MonitoringCockpitGridFooterButtonsComponent implements OnInit, OnChanges {
  public readonly states: typeof CountingCircleResultState = CountingCircleResultState;

  @Input()
  public politicalBusiness!: SimplePoliticalBusiness;

  @Input()
  public disabled: boolean = false;

  @Input()
  public countingCircleResults: FilteredCountingCircleResults[] = [];

  @Input()
  public filteredCountingCircleResults: FilteredCountingCircleResults[] = [];

  @Input()
  public readOnly: boolean = true;

  @Output()
  public updateAllStates: EventEmitter<CountingCircleResultState> = new EventEmitter<CountingCircleResultState>();

  public canResetAllToAuditedTentatively: boolean = false;
  public canPlausibiliseAll: boolean = false;

  private tenant?: Tenant;

  constructor(private readonly router: Router, private readonly auth: AuthorizationService, private readonly themeService: ThemeService) {}

  public async ngOnInit(): Promise<void> {
    this.tenant = await this.auth.getActiveTenant();
    this.updateAvailableButtons();
  }

  public ngOnChanges(): void {
    this.updateAvailableButtons();
  }

  public async navigateToEndResults(politicalBusiness: SimplePoliticalBusiness): Promise<void> {
    let routeKey = '';
    switch (politicalBusiness.businessType) {
      case PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_VOTE:
        routeKey = 'vote-end-results';
        break;
      case PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_PROPORTIONAL_ELECTION:
        routeKey = 'proportional-election-end-results';
        break;
      default:
        routeKey = 'majority-election-end-results';
        break;
    }

    await this.router.navigate([this.themeService.theme$.value, routeKey, politicalBusiness.id]);
  }

  private updateAvailableButtons(): void {
    if (!this.filteredCountingCircleResults || !this.politicalBusiness || !this.countingCircleResults) {
      return;
    }

    this.canResetAllToAuditedTentatively =
      this.isResponsibleMonitorAuthority() &&
      this.filteredCountingCircleResults
        .map(ccResult => ccResult.resultsByPoliticalBusinessId[this.politicalBusiness.id])
        .filter(r => !!r)
        .every(pbr => pbr.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_PLAUSIBILISED);

    this.updateCanPlausibiliseAll();
  }

  private isResponsibleMonitorAuthority(): boolean {
    return (
      !!this.tenant &&
      !!this.politicalBusiness.domainOfInfluence &&
      this.tenant.id === this.politicalBusiness.domainOfInfluence.secureConnectId
    );
  }

  private updateCanPlausibiliseAll(): void {
    const hasNotCorrectedResultsInPoliticalBusiness = this.countingCircleResults.some(
      cc => !cc.isCorrected && !!cc.resultsByPoliticalBusinessId[this.politicalBusiness.id],
    );
    const allPlausibilisedInPoliticalBusiness = this.countingCircleResults
      .map(cc => cc.resultsByPoliticalBusinessId[this.politicalBusiness.id])
      .filter(r => !!r)
      .every(r => r.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_PLAUSIBILISED);

    this.canPlausibiliseAll = !hasNotCorrectedResultsInPoliticalBusiness && !allPlausibilisedInPoliticalBusiness;
  }
}
