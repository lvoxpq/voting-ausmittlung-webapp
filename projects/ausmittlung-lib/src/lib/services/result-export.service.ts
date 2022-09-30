/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { FileDownloadService } from '@abraxas/voting-lib';
import { Inject, Injectable } from '@angular/core';
import {
  GenerateResultBundleReviewExportRequest,
  GenerateResultExportsRequest,
  ResultExportTemplate,
  ResultExportTemplateRequest,
} from '../models';
import { REST_API_URL_INJECTION_TOKEN } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class ResultExportService {
  private readonly apiUrl: string = '';

  constructor(private readonly fileDownloadService: FileDownloadService, @Inject(REST_API_URL_INJECTION_TOKEN) restApiUrl: string) {
    this.apiUrl = `${restApiUrl}/result_export`;
  }

  public async downloadExports(resultExportTemplates: ResultExportTemplate[], contestId: string): Promise<void> {
    const req: GenerateResultExportsRequest = {
      contestId,
      resultExportRequests: this.mapToResultExportRequests(resultExportTemplates),
    };
    return await this.fileDownloadService.postDownloadFile(this.apiUrl, req);
  }

  public async downloadResultBundleReviewExport(
    templateKey: string,
    contestId: string,
    countingCircleId: string,
    politicalBusinessResultBundleId: string,
    politicalBusinessId: string,
  ): Promise<void> {
    const req: GenerateResultBundleReviewExportRequest = {
      templateKey,
      contestId,
      countingCircleId,
      politicalBusinessResultBundleId,
      politicalBusinessId,
    };
    const url = `${this.apiUrl}/bundle_review`;
    return this.fileDownloadService.postDownloadFile(url, req);
  }

  private mapToResultExportRequests(data: ResultExportTemplate[]): ResultExportTemplateRequest[] {
    return data.map(x => this.mapToResultExportRequest(x));
  }

  private mapToResultExportRequest(data: ResultExportTemplate): ResultExportTemplateRequest {
    return {
      key: data.key,
      countingCircleId: data.countingCircleId,
      politicalBusinessIds: data.politicalBusinessIdsList,
      domainOfInfluenceType: data.domainOfInfluenceType,
      politicalBusinessUnionId: data.politicalBusinessUnionId,
    };
  }
}
