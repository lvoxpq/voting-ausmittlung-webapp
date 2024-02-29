/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  majorityElectionResultRoute,
  proportionalElectionResultRoute,
  ResultExportComponent,
  voteResultRoute,
  ContestCantonDefaultsResolver,
} from 'ausmittlung-lib';
import { ErfassungContestDetailComponent } from './pages/erfassung-contest-detail/erfassung-contest-detail.component';
import { ErfassungContestOverviewComponent } from './pages/erfassung-contest-overview/erfassung-contest-overview.component';
import { AuthThemeGuard, ThemeService } from '@abraxas/voting-lib';
import { ErfassungFinishSubmissionComponent } from './pages/erfassung-finish-submission/erfassung-finish-submission.component';

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
            component: ErfassungContestOverviewComponent,
          },
          {
            path: ':contestId/:countingCircleId',
            component: ErfassungContestDetailComponent,
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
          {
            path: ':contestId/:countingCircleId/finish-submission',
            component: ErfassungFinishSubmissionComponent,
            resolve: {
              contestCantonDefaults: ContestCantonDefaultsResolver,
            },
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
