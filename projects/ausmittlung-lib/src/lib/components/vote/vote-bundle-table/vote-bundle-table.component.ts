/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VoteReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/vote_pb';
import { AfterViewInit, Component, Input } from '@angular/core';
import { PermissionService } from '../../../services/permission.service';
import { UserService } from '../../../services/user.service';
import { ResultBundleTableComponent } from '../../result-bundle-table/result-bundle-table-component.directive';
import { EnumUtil } from '@abraxas/voting-lib';

@Component({
  selector: 'vo-ausm-vote-bundle-table',
  templateUrl: './vote-bundle-table.component.html',
  styleUrls: ['./vote-bundle-table.component.scss'],
})
export class VoteBundleTableComponent extends ResultBundleTableComponent implements AfterViewInit {
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
  public readonly reviewProcedures: typeof VoteReviewProcedure = VoteReviewProcedure;

  @Input()
  public reviewProcedure?: VoteReviewProcedure;

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
    return this.reviewProcedure === VoteReviewProcedure.VOTE_REVIEW_PROCEDURE_ELECTRONICALLY;
  }
}
