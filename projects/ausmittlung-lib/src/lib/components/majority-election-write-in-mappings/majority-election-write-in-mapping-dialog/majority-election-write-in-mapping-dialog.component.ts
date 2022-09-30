/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { SnackbarService } from '@abraxas/voting-lib';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MajorityElectionWriteInMapping, SimplePoliticalBusiness } from '../../../models';
import { MajorityElectionService } from '../../../services/majority-election.service';
import { ResultImportService } from '../../../services/result-import.service';
import { groupBySingle } from '../../../services/utils/array.utils';

@Component({
  selector: 'vo-ausm-majority-election-write-in-mapping-dialog',
  templateUrl: './majority-election-write-in-mapping-dialog.component.html',
  styleUrls: ['./majority-election-write-in-mapping-dialog.component.scss'],
})
export class MajorityElectionWriteInMappingDialogComponent implements OnInit {
  public saving: boolean = false;
  public loading: boolean = true;

  public hasInvalidVotes: boolean = false;
  public mappings: MajorityElectionWriteInMapping[] = [];

  public selectedElection?: SimplePoliticalBusiness;
  public selectedElectionIndex: number = 0;

  public elections: SimplePoliticalBusiness[] = [];

  private hasInvalidVotesByElectionId: Record<string, boolean> = {};
  private mappingsByElectionId: Record<string, MajorityElectionWriteInMapping[]> = {};

  private electionsById: Record<string, SimplePoliticalBusiness> = {};
  private importId: string = '';
  private readonly contestId: string;
  private readonly countingCircleId: string;

  constructor(
    private readonly dialogRef: MatDialogRef<ResultImportWriteInMappingDialogData>,
    private readonly toast: SnackbarService,
    private readonly i18n: TranslateService,
    private readonly majorityElectionService: MajorityElectionService,
    private readonly resultImportService: ResultImportService,
    @Inject(MAT_DIALOG_DATA) dialogData: ResultImportWriteInMappingDialogData,
  ) {
    this.contestId = dialogData.contestId;
    this.countingCircleId = dialogData.countingCircleId;
  }

  public async ngOnInit(): Promise<void> {
    try {
      this.loading = true;

      const contestWriteIns = await this.resultImportService.getMajorityElectionWriteInMappings(this.contestId, this.countingCircleId);

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

      this.mappingsByElectionId = groupBySingle(
        contestWriteIns.writeInGroups,
        x => x.election.id,
        x => x.writeInMappings,
      );

      this.selectElection(0);
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

  private selectElection(index: number): void {
    if (index === this.elections.length) {
      this.dialogRef.close(true);
      return;
    }

    this.selectedElectionIndex = index;
    this.selectedElection = this.elections[index];
    this.mappings = this.mappingsByElectionId[this.selectedElection.id];
    this.hasInvalidVotes = this.hasInvalidVotesByElectionId[this.selectedElection.id];
  }
}

export interface ResultImportWriteInMappingDialogData {
  contestId: string;
  countingCircleId: string;
}
