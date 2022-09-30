/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { majorityElectionResultRoute, proportionalElectionResultRoute, voteResultRoute } from 'ausmittlung-lib';
import { MajorityElectionEndResultComponent } from './pages/majority-election-end-result/majority-election-end-result.component';
import { MonitoringContestDetailComponent } from './pages/monitoring-contest-detail/monitoring-contest-detail.component';
import { MonitoringContestOverviewComponent } from './pages/monitoring-contest-overview/monitoring-contest-overview.component';
import { MonitoringOverviewComponent } from './pages/monitoring-overview/monitoring-overview.component';
import { ProportionalElectionEndResultComponent } from './pages/proportional-election-end-result/proportional-election-end-result.component';
import { VoteEndResultComponent } from './pages/vote-end-result/vote-end-result.component';
import { AuthThemeGuard } from '@abraxas/voting-lib';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'default',
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
          },
          {
            path: ':contestId/:countingCircleId',
            component: MonitoringContestDetailComponent,
          },
        ],
      },
      {
        path: 'vote-end-results/:voteId',
        component: VoteEndResultComponent,
      },
      {
        path: 'majority-election-end-results/:majorityElectionId',
        component: MajorityElectionEndResultComponent,
      },
      {
        path: 'proportional-election-end-results/:proportionalElectionId',
        component: ProportionalElectionEndResultComponent,
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
