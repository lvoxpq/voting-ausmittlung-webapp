/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProportionalElectionCandidate } from '../../../models';
import { ProportionalElectionBallotCandidatesChooseEntryComponent } from './proportional-election-ballot-candidates-choose-entry/proportional-election-ballot-candidates-choose-entry.component';

interface SearchableCandidate extends ProportionalElectionCandidate {
  queryable: string;
}

@Component({
  selector: 'vo-ausm-proportional-election-ballot-candidates-choose-dialog',
  templateUrl: './proportional-election-ballot-candidates-choose-dialog.component.html',
  styleUrls: ['./proportional-election-ballot-candidates-choose-dialog.component.scss'],
})
export class ProportionalElectionBallotCandidatesChooseDialogComponent implements AfterViewInit {
  public readonly allCandidates: SearchableCandidate[];
  public candidates: ProportionalElectionCandidate[];

  @ViewChildren(ProportionalElectionBallotCandidatesChooseEntryComponent)
  public candidateEntries!: QueryList<ProportionalElectionBallotCandidatesChooseEntryComponent>;

  private keyManager?: ActiveDescendantKeyManager<ProportionalElectionBallotCandidatesChooseEntryComponent>;

  constructor(
    private readonly dialogRef: MatDialogRef<ProportionalElectionCandidate[]>,
    @Inject(MAT_DIALOG_DATA) dialogData: ProportionalElectionCandidate[],
    private readonly cd: ChangeDetectorRef,
  ) {
    this.allCandidates = dialogData.map(c => ({
      ...c,
      queryable: `${c.description} ${c.listDescription}`.toUpperCase(),
    }));
    this.candidates = dialogData;
  }

  public ngAfterViewInit(): void {
    this.keyManager = new ActiveDescendantKeyManager(this.candidateEntries).withWrap().withVerticalOrientation();
  }

  @HostListener('document:keydown', ['$event'])
  public async keyDown(event: KeyboardEvent): Promise<void> {
    if (!this.keyManager) {
      return;
    }

    if (event.key === 'Enter' && this.keyManager.activeItem) {
      this.done(this.keyManager.activeItem.candidate);
      event.preventDefault();
      return;
    }

    this.keyManager.onKeydown(event);
  }

  public done(candidate?: ProportionalElectionCandidate): void {
    this.dialogRef.close(candidate);
  }

  public search(query: string): void {
    const upperQuery = query.toUpperCase();
    this.candidates = this.allCandidates.filter(c => c.queryable.includes(upperQuery));
    if (this.candidates.length > 0) {
      // detect changes to make sure that the filtered components are visible
      this.cd.detectChanges();
      this.keyManager?.setFirstItemActive();
    }
  }
}
