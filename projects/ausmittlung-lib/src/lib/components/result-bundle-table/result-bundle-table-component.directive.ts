/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { BallotBundleState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/ballot_bundle_pb';
import { AfterViewInit, Directive, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PoliticalBusinessResultBundle, User } from '../../models';
import { PermissionService } from '../../services/permission.service';
import { UserService } from '../../services/user.service';
import { AdvancedTablePaginatorComponent } from '@abraxas/base-components';
import { MatTableDataSource } from '@angular/material/table';
import { Permissions } from '../../models/permissions.model';

@Directive()
export abstract class ResultBundleTableComponent<T extends PoliticalBusinessResultBundle = PoliticalBusinessResultBundle>
  implements OnInit, AfterViewInit
{
  public readonly bundleStates: typeof BallotBundleState = BallotBundleState;
  public readonly dataSource = new MatTableDataSource<T>();

  @Input()
  public set bundles(bundles: T[]) {
    this.dataSource.data = bundles;
  }

  @Input()
  public bundleSize?: number;

  @Input()
  public enablePagination: boolean = false;

  @Input()
  public rowSelectable: boolean = false;

  @Input()
  public enableActions: boolean = false;

  @Input()
  public readOnly: boolean = false;

  @Output()
  public openDetail: EventEmitter<T> = new EventEmitter<T>();

  @Output()
  public reviewBundle: EventEmitter<T> = new EventEmitter<T>();

  @Output()
  public deleteBundle: EventEmitter<T> = new EventEmitter<T>();

  @Output()
  public succeedBundleReview: EventEmitter<T> = new EventEmitter<T>();

  @Output()
  public rejectBundleReview: EventEmitter<T> = new EventEmitter<T>();

  @ViewChild(AdvancedTablePaginatorComponent)
  public paginator?: AdvancedTablePaginatorComponent;

  public currentUser?: User;
  public canDeleteBundle: boolean = false;
  public canReviewBundle: boolean = false;
  public canUpdate: boolean = false;
  public canUpdateAll: boolean = false;
  public canRead: boolean = false;
  public canReadAll: boolean = false;

  protected constructor(private readonly userService: UserService, private readonly permissionService: PermissionService) {}

  public async ngOnInit(): Promise<void> {
    this.currentUser = await this.userService.getUser();
    this.canDeleteBundle = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResultBundle.Delete);
    this.canReviewBundle = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResultBundle.Review);
    this.canUpdate = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResultBallot.Update);
    this.canUpdateAll = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResultBundle.UpdateAll);
    this.canRead = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResultBallot.Read);
    this.canReadAll = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResultBallot.ReadAll);
  }

  public ngAfterViewInit(): void {
    if (this.enablePagination && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  public selectBundle(bundle: T): void {
    const isCreator = this.currentUser?.secureConnectId === bundle.createdBy.secureConnectId;

    if (
      !isCreator &&
      bundle.state === BallotBundleState.BALLOT_BUNDLE_STATE_READY_FOR_REVIEW &&
      this.canReviewBundle &&
      this.isReviewProcedureElectronically()
    ) {
      this.reviewBundle.emit(bundle);
      return;
    }

    if (!this.canReadAll && !(this.canRead && isCreator)) {
      return;
    }

    this.openDetail.emit(bundle);
  }

  protected abstract isReviewProcedureElectronically(): boolean;
}
