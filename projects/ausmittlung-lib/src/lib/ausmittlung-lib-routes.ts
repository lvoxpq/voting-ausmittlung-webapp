/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Route } from '@angular/router';
import { MajorityElectionBallotGroupsComponent } from './pages/majority-election/majority-election-ballot-groups/majority-election-ballot-groups.component';
import { MajorityElectionBallotReviewComponent } from './pages/majority-election/majority-election-ballot-review/majority-election-ballot-review.component';
import { MajorityElectionBallotComponent } from './pages/majority-election/majority-election-ballot/majority-election-ballot.component';
import { MajorityElectionBundleOverviewComponent } from './pages/majority-election/majority-election-bundle-overview/majority-election-bundle-overview.component';
import { ProportionalElectionBallotReviewComponent } from './pages/proportional-election/proportional-election-ballot-review/proportional-election-ballot-review.component';
import { ProportionalElectionBallotComponent } from './pages/proportional-election/proportional-election-ballot/proportional-election-ballot.component';
import { ProportionalElectionBundleOverviewComponent } from './pages/proportional-election/proportional-election-bundle-overview/proportional-election-bundle-overview.component';
import { ProportionalElectionResultsComponent } from './pages/proportional-election/proportional-election-results/proportional-election-results.component';
import { ProportionalElectionUnmodifiedListsComponent } from './pages/proportional-election/proportional-election-unmodified-lists/proportional-election-unmodified-lists.component';
import { VoteBallotReviewComponent } from './pages/vote/vote-ballot-review/vote-ballot-review.component';
import { VoteBallotComponent } from './pages/vote/vote-ballot/vote-ballot.component';
import { VoteBundleOverviewComponent } from './pages/vote/vote-bundle-overview/vote-bundle-overview.component';
import { ResultCantonDefaultsResolver } from './services/resolvers/result-canton-defaults.resolver';

export const proportionalElectionResultRoute: Route = {
  path: 'proportional-election-result/:resultId',
  children: [
    {
      path: 'unmodified',
      component: ProportionalElectionUnmodifiedListsComponent,
      resolve: {
        contestCantonDefaults: ResultCantonDefaultsResolver,
      },
    },
    {
      path: 'bundles',
      children: [
        {
          path: '',
          pathMatch: 'full',
          component: ProportionalElectionBundleOverviewComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
        {
          path: ':bundleId/review',
          component: ProportionalElectionBallotReviewComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
        {
          path: ':bundleId/:ballotNumber',
          component: ProportionalElectionBallotComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
      ],
    },
    {
      path: 'results',
      component: ProportionalElectionResultsComponent,
      resolve: {
        contestCantonDefaults: ResultCantonDefaultsResolver,
      },
    },
  ],
};

export const majorityElectionResultRoute: Route = {
  path: 'majority-election-result/:resultId',
  children: [
    {
      path: 'ballot-groups',
      component: MajorityElectionBallotGroupsComponent,
      resolve: {
        contestCantonDefaults: ResultCantonDefaultsResolver,
      },
    },
    {
      path: 'bundles',
      children: [
        {
          path: '',
          pathMatch: 'full',
          component: MajorityElectionBundleOverviewComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
        {
          path: ':bundleId/review',
          component: MajorityElectionBallotReviewComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
        {
          path: ':bundleId/:ballotNumber',
          component: MajorityElectionBallotComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
      ],
    },
  ],
};

export const voteResultRoute: Route = {
  path: 'vote-result/:resultId/ballot-result/:ballotResultId',
  children: [
    {
      path: 'bundles',
      children: [
        {
          path: '',
          pathMatch: 'full',
          component: VoteBundleOverviewComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
        {
          path: ':bundleId/review',
          component: VoteBallotReviewComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
        {
          path: ':bundleId/:ballotNumber',
          component: VoteBallotComponent,
          resolve: {
            contestCantonDefaults: ResultCantonDefaultsResolver,
          },
        },
      ],
    },
  ],
};
