/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesService {
  private readonly resultIdsWithUnsavedChanges: Set<string> = new Set<string>();

  public addUnsavedChange(resultId?: string): void {
    if (!resultId) {
      return;
    }

    this.resultIdsWithUnsavedChanges.add(resultId);
  }

  public removeUnsavedChange(resultId: string): void {
    this.resultIdsWithUnsavedChanges.delete(resultId);
  }

  public removeAllUnsavedChanges(): void {
    this.resultIdsWithUnsavedChanges.clear();
  }

  public hasUnsavedChanges(): boolean {
    return this.resultIdsWithUnsavedChanges.size !== 0;
  }
}
