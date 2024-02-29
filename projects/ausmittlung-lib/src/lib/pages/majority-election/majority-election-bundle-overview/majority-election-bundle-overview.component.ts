/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { MajorityElectionReviewProcedure } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/majority_election_pb';
import { DialogService, SnackbarService, ThemeService } from '@abraxas/voting-lib';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  PoliticalBusinessNewBundleNumberComponent,
  PoliticalBusinessNewBundleNumberComponentData,
} from '../../../components/political-business-new-bundle-number/political-business-new-bundle-number.component';
import { MajorityElectionResultBundles, PoliticalBusinessResultBundle } from '../../../models';
import { MajorityElectionResultBundleService } from '../../../services/majority-election-result-bundle.service';
import { ResultExportService } from '../../../services/result-export.service';
import { PermissionService } from '../../../services/permission.service';
import { PoliticalBusinessBundleOverviewComponent } from '../../political-business-bundle-overview/political-business-bundle-overview.component';
import { MajorityElectionBallotComponent } from '../majority-election-ballot/majority-election-ballot.component';

@Component({
  selector: 'vo-ausm-majority-election-bundle-overview',
  templateUrl: './majority-election-bundle-overview.component.html',
  styleUrls: ['./majority-election-bundle-overview.component.scss'],
})
export class MajorityElectionBundleOverviewComponent extends PoliticalBusinessBundleOverviewComponent<MajorityElectionResultBundles> {
  public result?: MajorityElectionResultBundles;
  public isCreatingBundle: boolean = false;

  constructor(
    private readonly resultBundleService: MajorityElectionResultBundleService,
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
      const response = await this.resultBundleService.createBundle(this.result.politicalBusinessResult.id, bundleNumber);
      await this.dialog.alert('APP.CONFIRM', this.i18n.instant('ELECTION.CONFIRM_BUNDLE_CREATION', { number: response.bundleNumber }));
      await this.router.navigate([response.bundleId, MajorityElectionBallotComponent.newId], {
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
    if (
      this.result?.politicalBusinessResult.entryParams?.reviewProcedure ===
      MajorityElectionReviewProcedure.MAJORITY_ELECTION_REVIEW_PROCEDURE_PHYSICALLY
    ) {
      return this.exportBundleReview(bundle);
    }
    return super.reviewBundle(bundle);
  }

  public async succeedBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (
      this.result?.politicalBusinessResult.entryParams?.reviewProcedure !==
      MajorityElectionReviewProcedure.MAJORITY_ELECTION_REVIEW_PROCEDURE_PHYSICALLY
    ) {
      return;
    }

    return this.resultBundleService.succeedBundleReview(bundle.id);
  }

  public async rejectBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (
      this.result?.politicalBusinessResult.entryParams?.reviewProcedure !==
      MajorityElectionReviewProcedure.MAJORITY_ELECTION_REVIEW_PROCEDURE_PHYSICALLY
    ) {
      return;
    }

    return this.resultBundleService.rejectBundleReview(bundle.id);
  }

  protected deleteBundleById(bundleId: string): Promise<void> {
    return this.resultBundleService.deleteBundle(bundleId);
  }

  protected loadBundles(resultId: string): Promise<MajorityElectionResultBundles> {
    return this.resultBundleService.getBundles(resultId);
  }

  protected startChangesListener(resultId: string, onRetry: () => {}): Observable<PoliticalBusinessResultBundle> {
    return this.resultBundleService.getBundleChanges(resultId, onRetry);
  }

  private async exportBundleReview(bundle: PoliticalBusinessResultBundle): Promise<void> {
    if (!this.result) {
      return;
    }
    const contestId = this.result.politicalBusinessResult.politicalBusiness.contestId;
    const countingCircleId = this.result.politicalBusinessResult.countingCircleId;
    await this.resultExportService.downloadResultBundleReviewExport(
      'majority_election_result_bundle_review',
      contestId,
      countingCircleId,
      bundle.id,
      this.result.politicalBusinessResult.politicalBusinessId,
    );
  }
}
