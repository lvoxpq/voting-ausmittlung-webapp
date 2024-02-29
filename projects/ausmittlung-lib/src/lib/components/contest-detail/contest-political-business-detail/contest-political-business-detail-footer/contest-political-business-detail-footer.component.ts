/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { CountingCircleResultState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';
import { DialogService } from '@abraxas/voting-lib';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StateChange } from '../../../../models';
import { PermissionService } from '../../../../services/permission.service';
import {
  ConfirmCommentDialogComponent,
  ConfirmCommentDialogData,
  ConfirmCommentDialogResult,
} from '../../../confirm-comment-dialog/confirm-comment-dialog.component';
import { Permissions } from '../../../../models/permissions.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vo-ausm-contest-political-business-detail-footer',
  templateUrl: './contest-political-business-detail-footer.component.html',
  styleUrls: ['./contest-political-business-detail-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestPoliticalBusinessDetailFooterComponent implements OnInit, OnDestroy {
  @Input()
  public entryDescriptionDetail?: any;

  @Input() // TODO: can be removed if new UI is standard
  public entryDescription: string = 'POLITICAL_BUSINESS.RESULTS_ENTRY.SELECTED';

  @Input() // TODO: can be removed if new UI is standard
  public editEntryText: string = 'POLITICAL_BUSINESS.RESULTS_ENTRY.EDIT_OLD';

  @Input()
  public isActionExecuting: boolean = false;

  @Input()
  public state: CountingCircleResultState = CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_INITIAL;

  @Input()
  public canValidateAndSave: boolean = false;

  @Input()
  public canValidate: boolean = false;

  @Input()
  public canSave: boolean = false;

  @Input()
  public canSubmit: boolean = false;

  @Input()
  public isResponsibleMonitorAuthority: boolean = false;

  @Input()
  public canSelectResultEntry: boolean = true;

  @Output()
  public selectResultEntry: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public validateAndSave: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public validate: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public save: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public stateUpdate: EventEmitter<StateChange> = new EventEmitter<StateChange>();

  public canEnterResults: boolean = false;
  public canFinishSubmission: boolean = false;
  public canAudit: boolean = false;
  public newZhFeaturesEnabled: boolean = false;

  public readonly states: typeof CountingCircleResultState = CountingCircleResultState;
  public readonly routeSubscription: Subscription;

  constructor(
    private readonly permissionService: PermissionService,
    private readonly dialogService: DialogService,
    private readonly i18n: TranslateService,
    private readonly cd: ChangeDetectorRef,
    route: ActivatedRoute,
  ) {
    this.routeSubscription = route.data.subscribe(async ({ contestCantonDefaults }) => {
      this.newZhFeaturesEnabled = contestCantonDefaults.newZhFeaturesEnabled;
    });
  }

  public async ngOnInit(): Promise<void> {
    this.canEnterResults = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResult.EnterResults);
    this.canFinishSubmission = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResult.FinishSubmission);
    this.canAudit = await this.permissionService.hasPermission(Permissions.PoliticalBusinessResult.Audit);
    this.cd.detectChanges();
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public async updateState(newState: CountingCircleResultState): Promise<void> {
    const stateChange: StateChange = {
      newState,
      oldState: this.state,
      comment: '',
    };
    const result = await this.confirmStateUpdate(stateChange);
    if (result.confirmed) {
      stateChange.comment = result.comment;
      this.stateUpdate.emit(stateChange);
    }
  }

  private async confirmStateUpdate(stateChange: StateChange): Promise<ConfirmCommentDialogResult> {
    const confirmMessageKey = this.getConfirmMessageKey(stateChange);
    if (!confirmMessageKey) {
      return { confirmed: true, comment: '' };
    }

    const confirmMessageParams = this.i18n.instant(confirmMessageKey);
    if (!confirmMessageParams.TITLE || !confirmMessageParams.MSG) {
      return { confirmed: true, comment: '' };
    }

    const data: ConfirmCommentDialogData = {
      title: confirmMessageParams.TITLE,
      message: confirmMessageParams.MSG,
      confirmText: confirmMessageParams.OK,
      hasComment: [
        CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION,
        CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE,
      ].includes(stateChange.newState),
      showCancel: true,
    };

    return (
      (await this.dialogService.openForResult(ConfirmCommentDialogComponent, data)) ?? {
        confirmed: false,
        comment: '',
      }
    );
  }

  private getConfirmMessageKey(stateChange: StateChange): string | undefined {
    switch (stateChange.newState) {
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE:
        if (stateChange.oldState === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_AUDITED_TENTATIVELY) {
          return;
        }
        return 'ACTIONS.SUBMISSION_DONE_CONFIRM';
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_CORRECTION_DONE:
        return 'ACTIONS.CORRECTION_DONE_CONFIRM';
      case CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION:
        return 'ACTIONS.FLAG_FOR_CORRECTION_CONFIRM';
    }
  }
}
