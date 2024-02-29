/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ProportionalElectionReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/proportional_election_pb';
import { AfterViewInit, Component, Input } from '@angular/core';
import { ProportionalElectionResultBundle } from '../../../models';
import { PermissionService } from '../../../services/permission.service';
import { UserService } from '../../../services/user.service';
import { ResultBundleTableComponent } from '../../result-bundle-table/result-bundle-table-component.directive';

@Component({
  selector: 'vo-ausm-proportional-election-bundle-table',
  templateUrl: './proportional-election-bundle-table.component.html',
})
export class ProportionalElectionBundleTableComponent
  extends ResultBundleTableComponent<ProportionalElectionResultBundle>
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

  @Input()
  public newZhFeaturesEnabled: boolean = false;

  constructor(userService: UserService, roleService: PermissionService) {
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
