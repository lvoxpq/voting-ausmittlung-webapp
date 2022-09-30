/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { BreadcrumbItem, BreadcrumbsService as BaseBreadcrumbsService } from 'ausmittlung-lib';
import { ProportionalElectionResult } from '../../../../ausmittlung-lib/src/lib/models';
import { Injectable } from '@angular/core';

@Injectable()
export class BreadcrumbsService extends BaseBreadcrumbsService {
  public readonly contestDetail: BreadcrumbItem[] = [
    {
      name: 'MONITORING_COCKPIT.TITLE',
      link: '..',
    },
    {
      name: 'CONTEST.DETAIL.TITLE',
    },
  ];

  public forProportionalElectionResults(electionResult?: ProportionalElectionResult): BreadcrumbItem[] {
    return [
      {
        name: 'MONITORING_COCKPIT.TITLE',
        link: !electionResult ? undefined : `../../../contests/${electionResult.election.contestId}`,
      },
      ...super.forProportionalElectionResults(electionResult),
    ];
  }
}
