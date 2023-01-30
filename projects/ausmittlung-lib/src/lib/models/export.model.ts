/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  ExportFileFormat,
  ResultExportConfiguration as ResultExportConfigurationProto,
  PoliticalBusinessExportMetadata as PoliticalBusinessExportMetadataProto,
  ResultExportTemplate as ResultExportTemplateProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/export_pb';
import { DomainOfInfluenceType } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/domain_of_influence_pb';

export type ResultExportTemplate = ResultExportTemplateProto.AsObject;
export type PoliticalBusinessExportMetadata = PoliticalBusinessExportMetadataProto.AsObject;
export { ExportFileFormat };

export type GenerateResultExportsRequest = {
  contestId: string;
  resultExportRequests: ResultExportTemplateRequest[];
};

export type GenerateResultBundleReviewExportRequest = {
  templateKey: string;
  contestId: string;
  countingCircleId: string;
  politicalBusinessResultBundleId: string;
  politicalBusinessId: string;
};

export type ResultExportTemplateRequest = {
  key: string;
  politicalBusinessIds: string[];
  countingCircleId: string;
  domainOfInfluenceType?: DomainOfInfluenceType;
  politicalBusinessUnionId?: string;
};

export type ResultExportConfiguration = Omit<
  ResultExportConfigurationProto.AsObject,
  'intervalMinutes' | 'politicalBusinessMetadataMap'
> & {
  intervalMinutes?: number;
  politicalBusinessMetadata: Map<string, PoliticalBusinessExportMetadata>;
};
