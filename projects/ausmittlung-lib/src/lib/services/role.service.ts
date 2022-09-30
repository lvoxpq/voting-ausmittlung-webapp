/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// should be overwritten by each app and provided via di
export abstract class RoleService {
  public get isErfassungElectionAdmin(): Observable<boolean> {
    return of(false);
  }

  public get isErfassungCreator(): Observable<boolean> {
    return of(false);
  }

  public get isMonitoringElectionAdmin(): Observable<boolean> {
    return of(false);
  }

  public get isErfassungUser(): Observable<boolean> {
    return combineLatest([this.isErfassungCreator, this.isErfassungElectionAdmin]).pipe(
      map(([creator, electionAdmin]) => creator || electionAdmin),
    );
  }
}
