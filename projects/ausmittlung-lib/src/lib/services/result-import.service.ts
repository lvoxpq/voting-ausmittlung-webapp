/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  DeleteResultImportDataRequest,
  GetMajorityElectionWriteInMappingsRequest,
  GetResultImportChangesRequest,
  ListResultImportsRequest,
  MapMajorityElectionWriteInRequest,
  MapMajorityElectionWriteInsRequest,
  ResetMajorityElectionWriteInMappingsRequest,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/requests/result_import_requests_pb';
import { ResultImportServicePromiseClient } from '@abraxas/voting-ausmittlung-service-proto/grpc/result_import_service_grpc_web_pb';
import { GrpcBackendService, GrpcEnvironment, GrpcService, retryForeverWithBackoff } from '@abraxas/voting-lib';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  ContestMajorityElectionWriteInMappings,
  MajorityElectionWriteInMapping,
  MajorityElectionWriteInMappings,
  PoliticalBusinessType,
  ResultImport,
  ResultImportChangeProto,
} from '../models';
import { MajorityElectionWriteInMappingsProto, MajorityElectionWriteInMappingTarget } from '../models/result-import.model';
import { PoliticalBusinessService } from './political-business.service';
import { GRPC_ENV_INJECTION_TOKEN, REST_API_URL_INJECTION_TOKEN } from './tokens';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResultImportService extends GrpcService<ResultImportServicePromiseClient> {
  private readonly apiUrl: string = '';

  constructor(
    private readonly http: HttpClient,
    @Inject(REST_API_URL_INJECTION_TOKEN) restApiUrl: string,
    grpcBackend: GrpcBackendService,
    @Inject(GRPC_ENV_INJECTION_TOKEN) env: GrpcEnvironment,
  ) {
    super(ResultImportServicePromiseClient, env ?? { production: false, grpcApiEndpoint: 'http://localhost:5100' }, grpcBackend);
    this.apiUrl = `${restApiUrl ?? 'http://localhost:5100/api'}/result_import/`;
  }

  public async import(contestId: string, eCH0222File: File, eCH0110File: File): Promise<void> {
    const data = new FormData();
    data.append('ech0222File', eCH0222File, eCH0222File.name);
    data.append('ech0110File', eCH0110File, eCH0110File.name);
    await firstValueFrom(this.http.post(`${this.apiUrl}${contestId}`, data));
  }

  public listImportedResultFiles(contestId: string): Promise<ResultImport[]> {
    const req = new ListResultImportsRequest();
    req.setContestId(contestId);
    return this.request(
      c => c.listImports,
      req,
      r =>
        r.getImportsList().map(x => ({
          ...x.toObject(),
          started: x.getStarted()!.toDate(),
        })),
    );
  }

  public deleteResultImportData(contestId: string): Promise<void> {
    const req = new DeleteResultImportDataRequest();
    req.setContestId(contestId);
    return this.requestEmptyResp(c => c.deleteImportData, req);
  }

  public async mapMajorityElectionWriteIns(
    importId: string,
    electionId: string,
    countingCircleId: string,
    pbType: PoliticalBusinessType,
    mappings: MajorityElectionWriteInMapping[],
  ): Promise<void> {
    const req = new MapMajorityElectionWriteInsRequest();
    req.setImportId(importId);
    req.setElectionId(electionId);
    req.setPoliticalBusinessType(pbType);
    req.setCountingCircleId(countingCircleId);
    req.setMappingsList(
      mappings.map(m => {
        const protoMapping = new MapMajorityElectionWriteInRequest();
        protoMapping.setWriteInId(m.id);
        protoMapping.setTarget(m.target);

        if (m.target === MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_CANDIDATE) {
          protoMapping.setCandidateId(m.candidateId);
        }

        return protoMapping;
      }),
    );
    await this.requestEmptyResp(c => c.mapMajorityElectionWriteIns, req);
  }

  public async getMajorityElectionWriteInMappings(
    contestId: string,
    countingCircleId: string,
  ): Promise<ContestMajorityElectionWriteInMappings> {
    const req = new GetMajorityElectionWriteInMappingsRequest();
    req.setCountingCircleId(countingCircleId);
    req.setContestId(contestId);
    const resp = await this.request(
      c => c.getMajorityElectionWriteInMappings,
      req,
      res => res,
    );

    return {
      importId: resp.getImportId(),
      writeInGroups: resp.getElectionWriteInMappingsList().map(x => this.mapMajorityElectionWriteIn(x)),
    };
  }

  public async resetMajorityElectionWriteIns(
    electionId: string,
    countingCircleId: string,
    contestId: string,
    pbType: PoliticalBusinessType,
  ): Promise<void> {
    const req = new ResetMajorityElectionWriteInMappingsRequest();
    req.setCountingCircleId(countingCircleId);
    req.setContestId(contestId);
    req.setElectionId(electionId);
    req.setPoliticalBusinessType(pbType);
    await this.requestEmptyResp(c => c.resetMajorityElectionWriteIns, req);
  }

  public getImportChanges(contestId: string, countingCircleId: string): Observable<ResultImportChangeProto.AsObject> {
    const req = new GetResultImportChangesRequest();
    req.setContestId(contestId);
    req.setCountingCircleId(countingCircleId);
    return this.requestServerStream(
      c => c.getImportChanges,
      req,
      r => r.toObject(),
    ).pipe(retryForeverWithBackoff());
  }

  private mapMajorityElectionWriteIn(proto: MajorityElectionWriteInMappingsProto): MajorityElectionWriteInMappings {
    const obj = proto.toObject();
    return {
      election: PoliticalBusinessService.mapToPoliticalBusiness(proto.getElection()!),
      invalidVotes: obj.invalidVotes,
      writeInMappings: obj.writeInMappingsList.map(writeIn => ({
        ...writeIn,
        selected: false,
      })),
    };
  }
}
