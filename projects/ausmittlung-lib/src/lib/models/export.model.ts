/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  ExportFileFormat,
  ResultExportConfiguration as ResultExportConfigurationProto,
  PoliticalBusinessExportMetadata as PoliticalBusinessExportMetadataProto,
  DataExportTemplate as DataExportTemplateProto,
  ProtocolExport as ProtocolExportProto,
  ProtocolExportState as ProtocolExportStateProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/export_pb';
import { Contest } from './contest.model';
import { CountingCircle } from './counting-circle.model';

export interface ProtocolExport extends Omit<ProtocolExportProto.AsObject, 'started'> {
  started: Date;
}
export type ResultExportTemplate = DataExportTemplateProto.AsObject | ProtocolExportProto.AsObject;
export type PoliticalBusinessExportMetadata = PoliticalBusinessExportMetadataProto.AsObject;
export { ExportFileFormat };

export type ResultExportTemplateContainer = {
  contest: Contest;
  countingCircle?: CountingCircle;
  templates: ResultExportTemplate[];
};

export type GenerateResultExportsRequest = {
  contestId: string;
  countingCircleId: string | undefined;
  exportTemplateIds: string[];
};

export type FetchProtocolExportsRequest = {
  contestId: string;
  countingCircleId: string | undefined;
  protocolExportIds: string[];
};

export type ProtocolExportStateChange = {
  exportTemplateId: string;
  protocolExportId: string;
  newState: ProtocolExportStateProto;
  fileName: string;
  started: Date;
};

export type GenerateResultBundleReviewExportRequest = {
  templateKey: string;
  contestId: string;
  countingCircleId: string;
  politicalBusinessResultBundleId: string;
  politicalBusinessId: string;
};

export type ResultExportConfiguration = Omit<
  ResultExportConfigurationProto.AsObject,
  'intervalMinutes' | 'politicalBusinessMetadataMap' | 'latestExecution'
> & {
  intervalMinutes?: number;
  politicalBusinessMetadata: Map<string, PoliticalBusinessExportMetadata>;
  latestExecution?: Date;
};
