/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, HostListener, OnDestroy } from '@angular/core';
import { HasUnsavedChanges, UnsavedChangesService } from 'ausmittlung-lib';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-erfassung-contest-detail',
  templateUrl: './erfassung-contest-detail.component.html',
})
export class ErfassungContestDetailComponent implements HasUnsavedChanges, OnDestroy {
  @HostListener('window:beforeunload')
  public beforeUnload(): boolean {
    if (!this.newZhFeaturesEnabled) {
      return true;
    }

    return !this.unsavedChangesService.hasUnsavedChanges();
  }

  public newZhFeaturesEnabled: boolean = false;

  public routeDataSubscription: Subscription;

  constructor(private readonly unsavedChangesService: UnsavedChangesService, route: ActivatedRoute) {
    this.routeDataSubscription = route.data.subscribe(async ({ contestCantonDefaults }) => {
      this.newZhFeaturesEnabled = contestCantonDefaults.newZhFeaturesEnabled;
    });
  }

  public get hasUnsavedChanges(): boolean {
    if (!this.newZhFeaturesEnabled) {
      return false;
    }

    return this.unsavedChangesService.hasUnsavedChanges();
  }

  public ngOnDestroy(): void {
    this.routeDataSubscription.unsubscribe();
    this.unsavedChangesService.removeAllUnsavedChanges();
  }
}
