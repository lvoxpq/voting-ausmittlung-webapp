/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { ProportionalElectionServicePromiseClient } from '@abraxas/voting-ausmittlung-service-proto/grpc/proportional_election_service_grpc_web_pb';
import {
  GetProportionalElectionListRequest,
  GetProportionalElectionListsRequest,
  ListProportionalElectionCandidatesRequest,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/requests/proportional_election_requests_pb';
import { GrpcBackendService, GrpcEnvironment, GrpcService } from '@abraxas/voting-lib';
import { Inject, Injectable } from '@angular/core';
import { ProportionalElection, ProportionalElectionCandidate, ProportionalElectionList, ProportionalElectionProto } from '../models';
import { ContestService } from './contest.service';
import { GRPC_ENV_INJECTION_TOKEN } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class ProportionalElectionService extends GrpcService<ProportionalElectionServicePromiseClient> {
  private candidatesCache: { [id: string]: ProportionalElectionCandidate[] } = {};

  constructor(grpcBackend: GrpcBackendService, @Inject(GRPC_ENV_INJECTION_TOKEN) env: GrpcEnvironment) {
    super(ProportionalElectionServicePromiseClient, env, grpcBackend);
  }

  public static mapToElection(proto: ProportionalElectionProto): ProportionalElection {
    const contest = proto.getContest();
    return {
      ...proto.toObject(),
      contest: !contest ? undefined : ContestService.mapToContest(contest),
    };
  }

  public async getLists(electionId: string): Promise<ProportionalElectionList[]> {
    const req = new GetProportionalElectionListsRequest();
    req.setElectionId(electionId);
    return await this.request(
      c => c.getLists,
      req,
      resp => resp.toObject().listsList,
    );
  }

  public async getList(listId: string): Promise<ProportionalElectionList> {
    const req = new GetProportionalElectionListRequest();
    req.setListId(listId);
    return await this.request(
      c => c.getList,
      req,
      resp => resp.toObject(),
    );
  }

  public async listCandidates(electionId: string): Promise<ProportionalElectionCandidate[]> {
    if (this.candidatesCache.hasOwnProperty(electionId)) {
      return this.candidatesCache[electionId];
    }

    // only keep the most recent election's candidates in memory
    this.candidatesCache = {};

    const req = new ListProportionalElectionCandidatesRequest();
    req.setElectionId(electionId);
    const candidates = await this.request(
      c => c.listCandidates,
      req,
      resp => resp.toObject().candidatesList,
    );
    this.candidatesCache[electionId] = candidates;
    return candidates;
  }
}
