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
export class ContestCantonDefaultsResolver extends CantonDefaultsBaseResolver {
  protected get idParam(): string {
    return 'contestId';
  }

  protected getCantonDefaultsRequest(id: string): GetCantonDefaultsRequest {
    const req = new GetCantonDefaultsRequest();
    req.setContestId(id);
    return req;
  }
}
