/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { CantonDefaultsBaseResolver } from './canton-defaults-base.resolver';
import { GetCantonDefaultsRequest } from '@abraxas/voting-ausmittlung-service-proto/grpc/requests/contest_requests_pb';

@Injectable({
  providedIn: 'root',
})
export class PoliticalBusinessCantonDefaultsResolver extends CantonDefaultsBaseResolver {
  protected get idParam(): string {
    return 'politicalBusinessId';
  }

  protected getCantonDefaultsRequest(id: string): GetCantonDefaultsRequest {
    const req = new GetCantonDefaultsRequest();
    req.setPoliticalBusinessId(id);
    return req;
  }
}
