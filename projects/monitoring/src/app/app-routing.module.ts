/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ContestCantonDefaultsResolver,
  PoliticalBusinessCantonDefaultsResolver,
  ResultExportComponent,
  majorityElectionResultRoute,
  proportionalElectionResultRoute,
  voteResultRoute,
} from 'ausmittlung-lib';
import { MajorityElectionEndResultComponent } from './pages/majority-election-end-result/majority-election-end-result.component';
import { MonitoringContestDetailComponent } from './pages/monitoring-contest-detail/monitoring-contest-detail.component';
import { MonitoringContestOverviewComponent } from './pages/monitoring-contest-overview/monitoring-contest-overview.component';
import { MonitoringOverviewComponent } from './pages/monitoring-overview/monitoring-overview.component';
import { ProportionalElectionEndResultComponent } from './pages/proportional-election-end-result/proportional-election-end-result.component';
import { VoteEndResultComponent } from './pages/vote-end-result/vote-end-result.component';
import { AuthThemeGuard, ThemeService } from '@abraxas/voting-lib';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ThemeService.NoTheme,
  },
  {
    path: ':theme',
    canActivate: [AuthThemeGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'contests',
      },
      {
        path: 'contests',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: MonitoringContestOverviewComponent,
          },
          {
            path: ':contestId',
            pathMatch: 'full',
            component: MonitoringOverviewComponent,
            resolve: {
              contestCantonDefaults: ContestCantonDefaultsResolver,
            },
          },
          {
            path: ':contestId/exports',
            component: ResultExportComponent,
            resolve: {
              contestCantonDefaults: ContestCantonDefaultsResolver,
            },
          },
          {
            path: ':contestId/:countingCircleId',
            component: MonitoringContestDetailComponent,
            resolve: {
              contestCantonDefaults: ContestCantonDefaultsResolver,
            },
          },
          {
            path: ':contestId/:countingCircleId/exports',
            component: ResultExportComponent,
            resolve: {
              contestCantonDefaults: ContestCantonDefaultsResolver,
            },
          },
        ],
      },
      {
        path: 'vote-end-results/:politicalBusinessId',
        component: VoteEndResultComponent,
        resolve: {
          contestCantonDefaults: PoliticalBusinessCantonDefaultsResolver,
        },
      },
      {
        path: 'majority-election-end-results/:politicalBusinessId',
        component: MajorityElectionEndResultComponent,
        resolve: {
          contestCantonDefaults: PoliticalBusinessCantonDefaultsResolver,
        },
      },
      {
        path: 'proportional-election-end-results/:politicalBusinessId',
        component: ProportionalElectionEndResultComponent,
        resolve: {
          contestCantonDefaults: PoliticalBusinessCantonDefaultsResolver,
        },
      },
      proportionalElectionResultRoute,
      majorityElectionResultRoute,
      voteResultRoute,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
