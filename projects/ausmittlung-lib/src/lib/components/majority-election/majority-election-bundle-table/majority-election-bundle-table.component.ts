/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { MajorityElectionReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/majority_election_pb';
import { AfterViewInit, Component, Input } from '@angular/core';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';
import { ElectionBundleTableComponent } from '../../election-bundle-table/election-bundle-table.component';

@Component({
  selector: 'vo-ausm-majority-election-bundle-table',
  templateUrl: './majority-election-bundle-table.component.html',
})
export class MajorityElectionBundleTableComponent extends ElectionBundleTableComponent implements AfterViewInit {
  public readonly columns = ['number', 'bundleSize', 'createdBy', 'countOfBallots', 'state', 'reviewedBy', 'actions'];
  public readonly reviewProcedures: typeof MajorityElectionReviewProcedure = MajorityElectionReviewProcedure;

  @Input()
  public reviewProcedure?: MajorityElectionReviewProcedure;

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
    return this.reviewProcedure === MajorityElectionReviewProcedure.MAJORITY_ELECTION_REVIEW_PROCEDURE_ELECTRONICALLY;
  }
}
