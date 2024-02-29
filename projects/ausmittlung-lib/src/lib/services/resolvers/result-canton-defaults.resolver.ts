/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { GetCantonDefaultsRequest } from '@abraxas/voting-ausmittlung-service-proto/grpc/requests/domain_of_influence_requests_pb';
import { CantonDefaultsBaseResolver } from './canton-defaults-base.resolver';

@Injectable({
  providedIn: 'root',
})
export class ResultCantonDefaultsResolver extends CantonDefaultsBaseResolver {
  protected get idParam(): string {
    return 'resultId';
  }

  protected getCantonDefaultsRequest(id: string): GetCantonDefaultsRequest {
    const req = new GetCantonDefaultsRequest();
    req.setCountingCircleResultId(id);
    return req;
  }
}
