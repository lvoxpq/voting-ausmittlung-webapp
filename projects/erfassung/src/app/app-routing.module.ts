/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { majorityElectionResultRoute, proportionalElectionResultRoute, voteResultRoute } from 'ausmittlung-lib';
import { ErfassungContestDetailComponent } from './pages/erfassung-contest-detail/erfassung-contest-detail.component';
import { ErfassungContestOverviewComponent } from './pages/erfassung-contest-overview/erfassung-contest-overview.component';
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
            component: ErfassungContestOverviewComponent,
          },
          {
            path: ':contestId/:countingCircleId',
            component: ErfassungContestDetailComponent,
          },
        ],
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
