/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { BallotBundleState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/ballot_bundle_pb';
import { EventEmitter, Input, OnDestroy, OnInit, Output, Directive, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoliticalBusinessResultBundle, User } from '../../models';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';
import { AdvancedTablePaginatorComponent } from '@abraxas/base-components';
import { MatTableDataSource } from '@angular/material/table';

@Directive()
export abstract class ElectionBundleTableComponent<T extends PoliticalBusinessResultBundle = PoliticalBusinessResultBundle>
  implements OnInit, OnDestroy, AfterViewInit
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
  public isErfassungCreator: boolean = false;
  public isErfassungElectionAdmin: boolean = false;
  public isMonitoringElectionAdmin: boolean = false;

  private readonly isErfassungCreatorSubscription: Subscription;
  private readonly isErfassungElectionAdminSubscription: Subscription;
  private readonly isMonitoringElectionAdminSubscription: Subscription;

  protected constructor(private readonly userService: UserService, roleService: RoleService) {
    this.isErfassungCreatorSubscription = roleService.isErfassungCreator.subscribe(x => (this.isErfassungCreator = x));
    this.isErfassungElectionAdminSubscription = roleService.isErfassungElectionAdmin.subscribe(x => (this.isErfassungElectionAdmin = x));
    this.isMonitoringElectionAdminSubscription = roleService.isMonitoringElectionAdmin.subscribe(x => (this.isMonitoringElectionAdmin = x));
  }

  public async ngOnInit(): Promise<void> {
    this.currentUser = await this.userService.getUser();
  }

  public ngAfterViewInit(): void {
    if (this.enablePagination && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  public ngOnDestroy(): void {
    this.isErfassungCreatorSubscription.unsubscribe();
    this.isErfassungElectionAdminSubscription.unsubscribe();
    this.isMonitoringElectionAdminSubscription.unsubscribe();
  }

  public selectBundle(bundle: T): void {
    const isCreator = this.currentUser?.secureConnectId === bundle.createdBy.secureConnectId;

    if (
      !isCreator &&
      bundle.state === BallotBundleState.BALLOT_BUNDLE_STATE_READY_FOR_REVIEW &&
      (this.isErfassungElectionAdmin || this.isErfassungCreator) &&
      this.isReviewProcedureElectronically()
    ) {
      this.reviewBundle.emit(bundle);
      return;
    }

    if (!this.isErfassungElectionAdmin && !this.isMonitoringElectionAdmin && !(this.isErfassungCreator && isCreator)) {
      return;
    }

    this.openDetail.emit(bundle);
  }

  protected abstract isReviewProcedureElectronically(): boolean;
}
