/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DomainOfInfluenceCantonDefaults } from '../../models';
import { from, Observable, of, tap } from 'rxjs';
import { DomainOfInfluenceService } from '../domain-of-influence.service';
import { GetCantonDefaultsRequest } from '@abraxas/voting-ausmittlung-service-proto/grpc/requests/domain_of_influence_requests_pb';
import { Directive } from '@angular/core';

@Directive()
export abstract class CantonDefaultsBaseResolver implements Resolve<DomainOfInfluenceCantonDefaults> {
  private cachedId?: string;
  private cachedCantonDefaults?: DomainOfInfluenceCantonDefaults;

  constructor(private readonly domainOfInfluenceService: DomainOfInfluenceService) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<DomainOfInfluenceCantonDefaults> {
    const id = route.paramMap.get(this.idParam);
    if (!id) {
      throw new Error('id not set');
    }

    if (this.cachedId === id) {
      return of(this.cachedCantonDefaults!);
    }

    this.cachedId = id;
    return from(this.domainOfInfluenceService.getCantonDefaults(this.getCantonDefaultsRequest(id))).pipe(
      tap(v => (this.cachedCantonDefaults = v)),
    );
  }

  protected abstract get idParam(): string;
  protected abstract getCantonDefaultsRequest(id: string): GetCantonDefaultsRequest;
}
