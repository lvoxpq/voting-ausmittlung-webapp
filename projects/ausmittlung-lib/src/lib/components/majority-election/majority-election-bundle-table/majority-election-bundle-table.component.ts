/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { MajorityElectionReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/majority_election_pb';
import { AfterViewInit, Component, Input } from '@angular/core';
import { PermissionService } from '../../../services/permission.service';
import { UserService } from '../../../services/user.service';
import { ResultBundleTableComponent } from '../../result-bundle-table/result-bundle-table-component.directive';
import { EnumUtil } from '@abraxas/voting-lib';

@Component({
  selector: 'vo-ausm-majority-election-bundle-table',
  templateUrl: './majority-election-bundle-table.component.html',
  styleUrls: ['./majority-election-bundle-table.component.scss'],
})
export class MajorityElectionBundleTableComponent extends ResultBundleTableComponent implements AfterViewInit {
  public readonly columns = [
    this.selectColumn,
    this.numberColumn,
    this.bundleSizeColumn,
    this.createdByColumn,
    this.countOfBallotsColumn,
    this.stateColumn,
    this.reviewedByColumn,
    this.actionsColumn,
  ];
  public readonly reviewProcedures: typeof MajorityElectionReviewProcedure = MajorityElectionReviewProcedure;

  @Input()
  public reviewProcedure?: MajorityElectionReviewProcedure;

  @Input()
  public newZhFeaturesEnabled: boolean = false;

  constructor(userService: UserService, roleService: PermissionService, enumUtil: EnumUtil) {
    super(userService, roleService, enumUtil);
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (!this.enableActions) {
      this.columns.splice(this.columns.length - 1, 1);
    }

    if (!this.enableReviewMultiple) {
      this.columns.splice(0, 1);
    }
  }

  protected isReviewProcedureElectronically(): boolean {
    return this.reviewProcedure === MajorityElectionReviewProcedure.MAJORITY_ELECTION_REVIEW_PROCEDURE_ELECTRONICALLY;
  }
}
