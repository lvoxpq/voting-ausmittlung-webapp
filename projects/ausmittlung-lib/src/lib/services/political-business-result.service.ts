/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { CountingCircleResultState } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoliticalBusinessResultService {
  private readonly resultStateChangedSubject: Subject<PoliticalBusinessResultStateChanged> =
    new Subject<PoliticalBusinessResultStateChanged>();

  public get resultStateChanged$(): Observable<PoliticalBusinessResultStateChanged> {
    return this.resultStateChangedSubject.asObservable();
  }

  public resultStateChanged(resultId: string, newState: CountingCircleResultState, comment?: string): void {
    this.resultStateChangedSubject.next({ resultId, newState, comment });
  }
}

export interface PoliticalBusinessResultStateChanged {
  resultId: string;
  newState: CountingCircleResultState;
  comment?: string;
}
