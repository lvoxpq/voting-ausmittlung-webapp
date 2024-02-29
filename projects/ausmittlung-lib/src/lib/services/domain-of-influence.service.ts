/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { GrpcBackendService, GrpcEnvironment, GrpcService } from '@abraxas/voting-lib';
import { Inject, Injectable } from '@angular/core';
import { DomainOfInfluenceCantonDefaults } from '../models';
import { GRPC_ENV_INJECTION_TOKEN } from './tokens';
import { DomainOfInfluenceServicePromiseClient } from '@abraxas/voting-ausmittlung-service-proto/grpc/domain_of_influence_service_grpc_web_pb';
import { GetCantonDefaultsRequest } from '@abraxas/voting-ausmittlung-service-proto/grpc/requests/domain_of_influence_requests_pb';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceService extends GrpcService<DomainOfInfluenceServicePromiseClient> {
  constructor(grpcBackend: GrpcBackendService, @Inject(GRPC_ENV_INJECTION_TOKEN) env: GrpcEnvironment) {
    super(DomainOfInfluenceServicePromiseClient, env, grpcBackend);
  }

  public getCantonDefaults(request: GetCantonDefaultsRequest): Promise<DomainOfInfluenceCantonDefaults> {
    return this.request(
      c => c.getCantonDefaults,
      request,
      r => r.toObject(),
    );
  }
}
