/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ProportionalElectionReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/proportional_election_pb';
import { DialogService, SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  ProportionalElectionNewBundleComponent,
  ProportionalElectionNewBundleComponentData,
  ProportionalElectionNewBundleComponentResult,
} from '../../../components/proportional-election/proportional-election-new-bundle/proportional-election-new-bundle.component';
import { PoliticalBusinessResultBundle, ProportionalElectionResultBundle, ProportionalElectionResultBundles } from '../../../models';
import { ProportionalElectionResultBundleService } from '../../../services/proportional-election-result-bundle.service';
import { ResultExportService } from '../../../services/result-export.service';
import { PermissionService } from '../../../services/permission.service';
import { PoliticalBusinessBundleOverviewComponent } from '../../political-business-bundle-overview/political-business-bundle-overview.component';
import { ProportionalElectionBallotComponent } from '../proportional-election-ballot/proportional-election-ballot.component';

@Component({
  selector: 'vo-ausm-proportional-election-bundle-overview',
  templateUrl: './proportional-election-bundle-overview.component.html',
  styleUrls: ['./proportional-election-bundle-overview.component.scss'],
})
export class ProportionalElectionBundleOverviewComponent extends PoliticalBusinessBundleOverviewComponent<ProportionalElectionResultBundles> {
  public readonly reviewProcedures: typeof ProportionalElectionReviewProcedure = ProportionalElectionReviewProcedure;

  constructor(
    permissionService: PermissionService,
    i18n: TranslateService,
    toast: SnackbarService,
    dialog: DialogService,
    route: ActivatedRoute,
    router: Router,
    themeService: ThemeService,
    resultExportService: ResultExportService,
    private readonly resultBundleService: ProportionalElectionResultBundleService,
  ) {
    super(permissionService, i18n, toast, dialog, route, router, themeService, resultExportService);
  }

  @HostListener('document:keydown.control.alt.q')
  public async createNewBundle(): Promise<void> {
    if (!this.result) {
      return;
    }

    const data: ProportionalElectionNewBundleComponentData = {
      electionId: this.result.politicalBusinessResult.election.id,
      electionResultId: this.result.politicalBusinessResult.id,
      enableBundleNumber: !this.result.politicalBusinessResult.entryParams.automaticBallotBundleNumberGeneration,
      usedBundleNumbers: this.getUsedBundleNumbers(this.result.bundles),
      deletedUnusedBundleNumbers: this.getDeletedUnusedBundleNumbers(this.result.bundles),
    };
    const result = await this.dialog.openForResult<ProportionalElectionNewBundleComponent, ProportionalElectionNewBundleComponentResult>(
      ProportionalElectionNewBundleComponent,
      data,
    );
    if (result) {
      await this.dialog.alert('APP.CONFIRM', this.i18n.instant('ELECTION.CONFIRM_BUNDLE_CREATION', { number: result.bundleNumber }));
      await this.router.navigate([result.bundleId, ProportionalElectionBallotComponent.newId], {
        relativeTo: this.route,
        queryParams: {
          listId: result.listId,
          bundleNumber: result.bundleNumber,
        },
      });
    }
  }

  public async reviewBundle(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (
      this.result?.politicalBusinessResult.entryParams?.reviewProcedure ===
      ProportionalElectionReviewProcedure.PROPORTIONAL_ELECTION_REVIEW_PROCEDURE_PHYSICALLY
    ) {
      return this.exportBundleReview(bundle);
    }
    return super.reviewBundle(bundle);
  }

  public async succeedBundleReview(bundles: PoliticalBusinessResultBundle[]): Promise<void> {
    if (
      this.result?.politicalBusinessResult.entryParams?.reviewProcedure !==
      ProportionalElectionReviewProcedure.PROPORTIONAL_ELECTION_REVIEW_PROCEDURE_PHYSICALLY
    ) {
      return;
    }

    return this.resultBundleService.succeedBundleReview(bundles.map(x => x.id));
  }

  public async rejectBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (
      this.result?.politicalBusinessResult.entryParams?.reviewProcedure !==
      ProportionalElectionReviewProcedure.PROPORTIONAL_ELECTION_REVIEW_PROCEDURE_PHYSICALLY
    ) {
      return;
    }

    return this.resultBundleService.rejectBundleReview(bundle.id);
  }

  protected deleteBundleById(bundleId: string): Promise<void> {
    return this.resultBundleService.deleteBundle(bundleId);
  }

  protected loadBundles(resultId: string): Promise<ProportionalElectionResultBundles> {
    return this.resultBundleService.getBundles(resultId);
  }

  protected startChangesListener(resultId: string, onRetry: () => {}): Observable<ProportionalElectionResultBundle> {
    return this.resultBundleService.getBundleChanges(resultId, onRetry);
  }

  private async exportBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (!this.result) {
      return;
    }
    const contestId = this.result.politicalBusinessResult.politicalBusiness.contestId;
    const countingCircleId = this.result.politicalBusinessResult.countingCircleId;
    await this.resultExportService.downloadResultBundleReviewExport(
      'proportional_election_result_bundle_review',
      contestId,
      countingCircleId,
      bundle.id,
      this.result.politicalBusinessResult.politicalBusinessId,
    );
  }
}
