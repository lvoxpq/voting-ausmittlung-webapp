/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MajorityElectionWriteInMapping, SimplePoliticalBusiness } from '../../../models';
import { ResultImportService } from '../../../services/result-import.service';
import { groupBySingle } from '../../../services/utils/array.utils';
import { MajorityElectionWriteInMappingTarget } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/majority_election_write_in_pb';

@Component({
  selector: 'vo-ausm-majority-election-write-in-mapping-dialog',
  templateUrl: './majority-election-write-in-mapping-dialog.component.html',
  styleUrls: ['./majority-election-write-in-mapping-dialog.component.scss'],
})
export class MajorityElectionWriteInMappingDialogComponent implements OnInit {
  public saving: boolean = false;
  public loading: boolean = true;

  public hasInvalidVotes: boolean = false;
  public hasIndividualVotes: boolean = false;
  public mappings: MajorityElectionWriteInMapping[] = [];

  public selectedElection?: SimplePoliticalBusiness;
  public readonly electionId?: string;
  public electionHasWriteIns: boolean = false;

  public selectedElectionIndex: number = 0;

  public elections: SimplePoliticalBusiness[] = [];

  private hasInvalidVotesByElectionId: Record<string, boolean> = {};
  private hasIndividualVotesByElectionId: Record<string, boolean> = {};
  private mappingsByElectionId: Record<string, MajorityElectionWriteInMapping[]> = {};

  private electionsById: Record<string, SimplePoliticalBusiness> = {};
  private importId: string = '';
  private readonly contestId: string;
  private readonly countingCircleId: string;

  constructor(
    private readonly dialogRef: MatDialogRef<void>,
    private readonly resultImportService: ResultImportService,
    @Inject(MAT_DIALOG_DATA) dialogData: ResultImportWriteInMappingDialogData,
  ) {
    this.contestId = dialogData.contestId;
    this.countingCircleId = dialogData.countingCircleId;
    this.electionId = dialogData.electionId;

    // enforce user to click on cancel to differ between reset write ins and normally close dialog
    this.dialogRef.disableClose = true;
  }

  public async ngOnInit(): Promise<void> {
    try {
      this.loading = true;

      const contestWriteIns = await this.resultImportService.getMajorityElectionWriteInMappings(this.contestId, this.countingCircleId);

      if (this.electionId) {
        contestWriteIns.writeInGroups = contestWriteIns.writeInGroups.filter(m => m.election.id === this.electionId);
      }

      this.importId = contestWriteIns.importId;
      this.elections = contestWriteIns.writeInGroups.map(m => m.election);
      this.electionsById = groupBySingle(
        this.elections,
        x => x.id,
        x => x,
      );

      this.hasInvalidVotesByElectionId = groupBySingle(
        contestWriteIns.writeInGroups,
        x => x.election.id,
        x => x.invalidVotes,
      );

      this.hasIndividualVotesByElectionId = groupBySingle(
        contestWriteIns.writeInGroups,
        x => x.election.id,
        x => x.individualVotes,
      );

      this.mappingsByElectionId = groupBySingle(
        contestWriteIns.writeInGroups,
        x => x.election.id,
        x => x.writeInMappings,
      );
      if (this.elections.length > 0) {
        this.selectElection(0);
      }
    } finally {
      this.loading = false;
    }
  }

  public setMappings(mappings: MajorityElectionWriteInMapping[]): void {
    if (this.selectedElection === undefined) {
      return;
    }

    this.mappings = mappings;
    this.mappingsByElectionId[this.selectedElection.id] = mappings;
  }

  public async selectedElectionChange(index: number): Promise<void> {
    await this.save();
    this.selectElection(index);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public async save(): Promise<void> {
    if (this.selectedElection === undefined) {
      return;
    }

    try {
      this.saving = true;
      await this.resultImportService.mapMajorityElectionWriteIns(
        this.importId,
        this.selectedElection.id,
        this.countingCircleId,
        this.selectedElection.businessType,
        this.mappings,
      );
    } finally {
      this.saving = false;
    }
  }

  public async resetWriteIns(): Promise<void> {
    if (this.selectedElection === undefined) {
      return;
    }

    try {
      this.saving = true;
      await this.resultImportService.resetMajorityElectionWriteIns(
        this.selectedElection.id,
        this.countingCircleId,
        this.contestId,
        this.selectedElection.businessType,
      );
    } finally {
      this.saving = false;
    }
  }

  public hasUnmappedWriteIns(): boolean {
    return this.mappings.some(m => m.target === MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_UNSPECIFIED);
  }

  private selectElection(index: number): void {
    if (index === this.elections.length) {
      this.dialogRef.close();
      return;
    }

    this.electionHasWriteIns = true;
    this.selectedElectionIndex = index;
    this.selectedElection = this.elections[index];
    this.mappings = this.mappingsByElectionId[this.selectedElection.id];
    this.hasInvalidVotes = this.hasInvalidVotesByElectionId[this.selectedElection.id];
    this.hasIndividualVotes = this.hasIndividualVotesByElectionId[this.selectedElection.id];
  }
}

export interface ResultImportWriteInMappingDialogData {
  contestId: string;
  countingCircleId: string;
  electionId?: string;
}
