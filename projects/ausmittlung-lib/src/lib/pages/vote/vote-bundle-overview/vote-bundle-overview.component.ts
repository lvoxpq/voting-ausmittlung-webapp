/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VoteReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/vote_pb';
import { DialogService, SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  PoliticalBusinessNewBundleNumberComponent,
  PoliticalBusinessNewBundleNumberComponentData,
} from '../../../components/political-business-new-bundle-number/political-business-new-bundle-number.component';
import { PoliticalBusinessResultBundle, VoteResultBundles } from '../../../models';
import { ResultExportService } from '../../../services/result-export.service';
import { PermissionService } from '../../../services/permission.service';
import { VoteResultBundleService } from '../../../services/vote-result-bundle.service';
import { PoliticalBusinessBundleOverviewComponent } from '../../political-business-bundle-overview/political-business-bundle-overview.component';
import { VoteBallotComponent } from '../vote-ballot/vote-ballot.component';

@Component({
  selector: 'vo-ausm-vote-bundle-overview',
  templateUrl: './vote-bundle-overview.component.html',
  styleUrls: ['./vote-bundle-overview.component.scss'],
})
export class VoteBundleOverviewComponent extends PoliticalBusinessBundleOverviewComponent<VoteResultBundles> {
  public result?: VoteResultBundles;
  public isCreatingBundle: boolean = false;

  constructor(
    private readonly resultBundleService: VoteResultBundleService,
    permissionService: PermissionService,
    i18n: TranslateService,
    toast: SnackbarService,
    dialog: DialogService,
    route: ActivatedRoute,
    router: Router,
    themeService: ThemeService,
    resultExportService: ResultExportService,
  ) {
    super(permissionService, i18n, toast, dialog, route, router, themeService, resultExportService);
  }

  @HostListener('document:keydown.control.alt.q')
  public async createNewBundle(): Promise<void> {
    if (!this.result || !this.result.politicalBusinessResult.entryParams) {
      return;
    }

    let bundleNumber: number | undefined;
    if (!this.result.politicalBusinessResult.entryParams.automaticBallotBundleNumberGeneration) {
      const data: PoliticalBusinessNewBundleNumberComponentData = {
        deletedUnusedBundleNumbers: this.getDeletedUnusedBundleNumbers(this.result.bundles),
        usedBundleNumbers: this.getUsedBundleNumbers(this.result.bundles),
      };
      bundleNumber = await this.dialog.openForResult<PoliticalBusinessNewBundleNumberComponent, number>(
        PoliticalBusinessNewBundleNumberComponent,
        data,
      );
      if (!bundleNumber) {
        return;
      }
    }

    this.isCreatingBundle = true;
    try {
      const response = await this.resultBundleService.createBundle(
        this.result.politicalBusinessResult.id,
        this.result.ballotResult.id,
        bundleNumber,
      );
      await this.router.navigate([response.bundleId, VoteBallotComponent.newId], {
        relativeTo: this.route,
        queryParams: {
          bundleNumber: response.bundleNumber,
        },
      });
    } finally {
      this.isCreatingBundle = false;
    }
  }

  public async reviewBundle(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (this.result?.politicalBusinessResult.entryParams?.reviewProcedure === VoteReviewProcedure.VOTE_REVIEW_PROCEDURE_PHYSICALLY) {
      return this.exportBundleReview(bundle);
    }
    return super.reviewBundle(bundle);
  }

  public async succeedBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (this.result?.politicalBusinessResult.entryParams?.reviewProcedure !== VoteReviewProcedure.VOTE_REVIEW_PROCEDURE_PHYSICALLY) {
      return;
    }

    return this.resultBundleService.succeedBundleReview(bundle.id);
  }

  public async rejectBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (this.result?.politicalBusinessResult.entryParams?.reviewProcedure !== VoteReviewProcedure.VOTE_REVIEW_PROCEDURE_PHYSICALLY) {
      return;
    }

    return this.resultBundleService.rejectBundleReview(bundle.id);
  }

  protected deleteBundleById(bundleId: string): Promise<void> {
    return this.resultBundleService.deleteBundle(bundleId, this.result!.ballotResult.id);
  }

  protected loadBundles(resultId: string, params: Params): Promise<VoteResultBundles> {
    return this.resultBundleService.getBundles(params.ballotResultId);
  }

  protected override startChangesListener(resultId: string, params: Params, onRetry: () => {}): Observable<PoliticalBusinessResultBundle> {
    return this.resultBundleService.getBundleChanges(params.ballotResultId, onRetry);
  }

  private async exportBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (!this.result) {
      return;
    }
    const contestId = this.result.politicalBusinessResult.politicalBusiness.contestId;
    const countingCircleId = this.result.politicalBusinessResult.countingCircleId;
    await this.resultExportService.downloadResultBundleReviewExport(
      'vote_result_bundle_review',
      contestId,
      countingCircleId,
      bundle.id,
      this.result.politicalBusinessResult.politicalBusinessId,
    );
  }
}
