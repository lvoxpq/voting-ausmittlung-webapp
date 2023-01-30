/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { ExportServicePromiseClient } from '@abraxas/voting-ausmittlung-service-proto/grpc/export_service_grpc_web_pb';
import {
  GetContestExportTemplatesRequest,
  GetCountingCircleResultExportTemplatesRequest,
  GetMultiplePoliticalBusinessesCountingCircleResultExportTemplatesRequest,
  GetMultiplePoliticalBusinessesResultExportTemplatesRequest,
  GetPoliticalBusinessResultExportTemplatesRequest,
  GetPoliticalBusinessUnionResultExportTemplatesRequest,
  ListResultExportConfigurationsRequest,
  TriggerResultExportRequest,
  UpdatePoliticalBusinessExportMetadataRequest,
  UpdateResultExportConfigurationRequest,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/requests/export_requests_pb';
import { GrpcBackendService, GrpcEnvironment, GrpcService } from '@abraxas/voting-lib';
import { Inject, Injectable } from '@angular/core';
import { Int32Value } from 'google-protobuf/google/protobuf/wrappers_pb';
import {
  PoliticalBusinessExportMetadata,
  PoliticalBusinessType,
  PoliticalBusinessUnion,
  PoliticalBusinessUnionType,
  ResultExportConfiguration,
  ResultExportTemplate,
  SimplePoliticalBusiness,
} from '../models';
import { GRPC_ENV_INJECTION_TOKEN } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class ExportService extends GrpcService<ExportServicePromiseClient> {
  constructor(grpcBackend: GrpcBackendService, @Inject(GRPC_ENV_INJECTION_TOKEN) env: GrpcEnvironment) {
    super(ExportServicePromiseClient, env, grpcBackend);
  }

  public getCountingCircleResultExportTemplates(ccId: string, politicalBusiness: SimplePoliticalBusiness): Promise<ResultExportTemplate[]> {
    const req = new GetCountingCircleResultExportTemplatesRequest();
    req.setCountingCircleId(ccId);
    req.setPoliticalBusinessId(politicalBusiness.id);
    req.setPoliticalBusinessType(politicalBusiness.businessType);
    return this.request(
      c => c.getCountingCircleResultExportTemplates,
      req,
      r => r.toObject().templatesList,
    );
  }

  public getPoliticalBusinessResultExportTemplates(pb: SimplePoliticalBusiness): Promise<ResultExportTemplate[]> {
    const req = new GetPoliticalBusinessResultExportTemplatesRequest();
    req.setPoliticalBusinessId(pb.id);
    req.setPoliticalBusinessType(pb.businessType);
    return this.request(
      c => c.getPoliticalBusinessResultExportTemplates,
      req,
      r => r.toObject().templatesList,
    );
  }

  public getPoliticalBusinessUnionResultExportTemplates(pbu: PoliticalBusinessUnion): Promise<ResultExportTemplate[]> {
    const pbType =
      pbu.type === PoliticalBusinessUnionType.POLITICAL_BUSINESS_UNION_TYPE_PROPORTIONAL_ELECTION
        ? PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_PROPORTIONAL_ELECTION
        : PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_MAJORITY_ELECTION;

    const req = new GetPoliticalBusinessUnionResultExportTemplatesRequest();
    req.setPoliticalBusinessUnionId(pbu.id);
    req.setPoliticalBusinessType(pbType);
    return this.request(
      c => c.getPoliticalBusinessUnionResultExportTemplates,
      req,
      r => r.toObject().templatesList,
    );
  }

  public getMultiplePoliticalBusinessesResultExportTemplates(contestId: string): Promise<ResultExportTemplate[]> {
    const req = new GetMultiplePoliticalBusinessesResultExportTemplatesRequest();
    req.setContestId(contestId);
    return this.request(
      c => c.getMultiplePoliticalBusinessesResultExportTemplates,
      req,
      r => r.toObject().templatesList,
    );
  }

  public getMultiplePoliticalBusinessesCountingCircleResultExportTemplates(
    contestId: string,
    countingCircleId: string,
  ): Promise<ResultExportTemplate[]> {
    const req = new GetMultiplePoliticalBusinessesCountingCircleResultExportTemplatesRequest();
    req.setContestId(contestId);
    req.setCountingCircleId(countingCircleId);
    return this.request(
      c => c.getMultiplePoliticalBusinessesCountingCircleResultExportTemplates,
      req,
      r => r.toObject().templatesList,
    );
  }

  public getContestExportTemplates(contestId: string): Promise<ResultExportTemplate[]> {
    const req = new GetContestExportTemplatesRequest();
    req.setContestId(contestId);
    return this.request(
      c => c.getContestExportTemplates,
      req,
      r => r.toObject().templatesList,
    );
  }

  public listResultExportConfigurations(contestId: string): Promise<ResultExportConfiguration[]> {
    const req = new ListResultExportConfigurationsRequest();
    req.setContestId(contestId);
    return this.request(
      c => c.listResultExportConfigurations,
      req,
      r =>
        r.toObject().configurationsList.map(x => ({
          ...x,
          intervalMinutes: x.intervalMinutes?.value,
          politicalBusinessMetadata: this.mapToMetadataMap(x.politicalBusinessMetadataMap),
        })),
    );
  }

  public updateResultExportConfigurations(config: ResultExportConfiguration): Promise<void> {
    const req = new UpdateResultExportConfigurationRequest();
    req.setContestId(config.contestId);
    req.setExportConfigurationId(config.exportConfigurationId);
    req.setPoliticalBusinessIdsList(config.politicalBusinessIdsList);

    const reqMetadataMap = req.getPoliticalBusinessMetadataMap();
    for (const metadataEntry of config.politicalBusinessMetadata) {
      reqMetadataMap.set(metadataEntry[0], this.mapToUpdateMetadataRequest(metadataEntry[1]));
    }

    if (config.intervalMinutes !== undefined) {
      const intervalMinutes = new Int32Value();
      intervalMinutes.setValue(config.intervalMinutes);
      req.setIntervalMinutes(intervalMinutes);
    }

    return this.requestEmptyResp(c => c.updateResultExportConfiguration, req);
  }

  public triggerResultExportConfigurations(
    contestId: string,
    exportConfigurationId: string,
    politicalBusinessIds: string[],
    politicalBusinessMetadata: Map<string, PoliticalBusinessExportMetadata>,
  ): Promise<void> {
    const req = new TriggerResultExportRequest();
    req.setContestId(contestId);
    req.setExportConfigurationId(exportConfigurationId);
    req.setPoliticalBusinessIdsList(politicalBusinessIds);

    const reqMetadataMap = req.getPoliticalBusinessMetadataMap();
    for (const metadataEntry of politicalBusinessMetadata) {
      reqMetadataMap.set(metadataEntry[0], this.mapToUpdateMetadataRequest(metadataEntry[1]));
    }

    return this.requestEmptyResp(x => x.triggerResultExport, req);
  }

  private mapToMetadataMap(metadata: [string, PoliticalBusinessExportMetadata][]): Map<string, PoliticalBusinessExportMetadata> {
    const map = new Map<string, PoliticalBusinessExportMetadata>();
    for (const entry of metadata) {
      map.set(entry[0], entry[1]);
    }

    return map;
  }

  private mapToUpdateMetadataRequest(metadata: PoliticalBusinessExportMetadata): UpdatePoliticalBusinessExportMetadataRequest {
    const req = new UpdatePoliticalBusinessExportMetadataRequest();
    req.setToken(metadata.token);
    return req;
  }
}
