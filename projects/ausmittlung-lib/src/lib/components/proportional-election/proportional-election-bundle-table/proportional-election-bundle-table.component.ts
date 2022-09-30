/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { ProportionalElectionReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/proportional_election_pb';
import { AfterViewInit, Component, Input } from '@angular/core';
import { ProportionalElectionResultBundle } from '../../../models';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { ElectionBundleTableComponent } from '../../election-bundle-table/election-bundle-table.component';

@Component({
  selector: 'vo-ausm-proportional-election-bundle-table',
  templateUrl: './proportional-election-bundle-table.component.html',
})
export class ProportionalElectionBundleTableComponent
  extends ElectionBundleTableComponent<ProportionalElectionResultBundle>
  implements AfterViewInit
{
  public readonly columns = [
    'number',
    'bundleSize',
    'listOrderNumber',
    'listShortDescription',
    'createdBy',
    'countOfBallots',
    'state',
    'reviewedBy',
    'actions',
  ];
  public readonly reviewProcedures: typeof ProportionalElectionReviewProcedure = ProportionalElectionReviewProcedure;

  @Input()
  public reviewProcedure?: ProportionalElectionReviewProcedure;

  constructor(userService: UserService, roleService: RoleService) {
    super(userService, roleService);
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (!this.enableActions) {
      this.columns.splice(this.columns.length - 1, 1);
    }
  }

  protected isReviewProcedureElectronically(): boolean {
    return this.reviewProcedure === ProportionalElectionReviewProcedure.PROPORTIONAL_ELECTION_REVIEW_PROCEDURE_ELECTRONICALLY;
  }
}
