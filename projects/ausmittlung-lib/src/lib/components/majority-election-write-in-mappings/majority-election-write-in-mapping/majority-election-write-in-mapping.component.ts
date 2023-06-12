/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import {
  MajorityElectionCandidate,
  MajorityElectionWriteInMapping,
  MajorityElectionWriteInMappingTarget,
  PoliticalBusinessType,
  SimplePoliticalBusiness,
} from '../../../models';
import { MajorityElectionService } from '../../../services/majority-election.service';
import { groupBySingle } from '../../../services/utils/array.utils';

interface CandidateWithMappings {
  candidate: MajorityElectionCandidate;
  writeInMappings: MajorityElectionWriteInMapping[];
  totalWriteInVoteCount: number;
}

interface KeyboardMessage {
  msg: string;
  error: boolean;
}

const individualCandidateId = 'const-candidate-id-individual';
const invalidCandidateId = 'const-candidate-id-invalid';
const emptyCandidateId = 'const-candidate-id-empty';

const invalidCandidateNr = '97';
const individualCandidateNr = '98';
const emptyCandidateNr = '99';

const mappingTargetsByCandidateId: Record<string, MajorityElectionWriteInMappingTarget> = {
  [individualCandidateId]: MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_INDIVIDUAL,
  [invalidCandidateId]: MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_INVALID,
  [emptyCandidateId]: MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_EMPTY,
};

const candidateIdByMappingTarget: Record<MajorityElectionWriteInMappingTarget, string | undefined> = {
  [MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_INDIVIDUAL]: individualCandidateId,
  [MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_INVALID]: invalidCandidateId,
  [MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_EMPTY]: emptyCandidateId,
  [MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_UNSPECIFIED]: undefined,
  [MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_CANDIDATE]: undefined,
};

@Component({
  selector: 'vo-ausm-majority-election-write-in-mapping',
  templateUrl: './majority-election-write-in-mapping.component.html',
  styleUrls: ['./majority-election-write-in-mapping.component.scss'],
})
export class MajorityElectionWriteInMappingComponent implements OnChanges {
  public loadingCandidates: boolean = true;
  public candidatesWithMappings: CandidateWithMappings[] = [];
  public availableWriteInMappings: MajorityElectionWriteInMapping[] = [];
  public recordedCandidateNumber: string = '';
  public readonly keyboardCandidateAssignedMessage$: Observable<KeyboardMessage>;

  @Input()
  public readOnly: boolean = true;

  @Input()
  public election!: SimplePoliticalBusiness;

  @Input()
  public writeInMappings: MajorityElectionWriteInMapping[] = [];

  @Input()
  public invalidVotes: boolean = false;

  @Input()
  public canShowNextElection: boolean = false;

  @Input()
  public canShowResetMappings: boolean = false;

  @Output()
  public writeInMappingsChange: EventEmitter<MajorityElectionWriteInMapping[]> = new EventEmitter<MajorityElectionWriteInMapping[]>();

  @Output()
  public showNextElection: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public resetMappings: EventEmitter<void> = new EventEmitter<void>();

  private writeInMappingsById: Record<string, MajorityElectionWriteInMapping> = {};
  private candidatesByNumber: Record<string, CandidateWithMappings> = {};
  private isCtrlDown: boolean = false;
  private selectedWriteInMappings: MajorityElectionWriteInMapping[] = [];
  private readonly keyboardCandidateAssignedMessage: Subject<KeyboardMessage> = new Subject<KeyboardMessage>();
  private readonly keyboardCandidateAssignedMessageReset: Subject<void> = new Subject<void>();

  constructor(private readonly majorityElectionService: MajorityElectionService, private readonly i18n: TranslateService) {
    // messages with content are immediately shown.
    // messages without content leave the previous message for 2s
    this.keyboardCandidateAssignedMessage$ = merge(
      this.keyboardCandidateAssignedMessage,
      this.keyboardCandidateAssignedMessageReset.pipe(
        debounceTime(2000),
        map(() => ({ msg: '', error: false })),
      ),
    );
  }

  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.election === undefined) {
      return;
    }

    this.writeInMappingsById = groupBySingle(
      this.writeInMappings,
      x => x.id,
      x => x,
    );
    await this.loadCandidates();
    this.updateCandidateMappings();
    this.updateAvailableWriteInMappings();
  }

  @HostListener('document:keyup', ['$event'])
  public async keyup(event: KeyboardEvent): Promise<void> {
    if (event.key !== 'Control') {
      return;
    }

    this.isCtrlDown = false;
    if (!this.recordedCandidateNumber) {
      return;
    }

    const candidate = this.candidatesByNumber[this.recordedCandidateNumber];
    if (this.selectedWriteInMappings.length === 0) {
      const msg = this.i18n.instant('RESULT_IMPORT.WRITE_INS.NO_CANDIDATE_SELECTED');
      this.keyboardCandidateAssignedMessage.next({
        msg,
        error: true,
      });
    } else if (candidate !== undefined) {
      for (const selectedMapping of this.selectedWriteInMappings) {
        this.addMapping(selectedMapping, candidate);
      }

      const msg = this.i18n.instant('RESULT_IMPORT.WRITE_INS.ADDED_TO_CANDIDATE', candidate.candidate);
      this.keyboardCandidateAssignedMessage.next({
        msg,
        error: false,
      });
      this.selectFirstAvailableWriteInMapping();
    } else {
      const msg = this.i18n.instant('RESULT_IMPORT.WRITE_INS.COULD_NOT_FIND_CANDIDATE', {
        number: this.recordedCandidateNumber,
      });
      this.keyboardCandidateAssignedMessage.next({
        msg,
        error: true,
      });
    }

    this.keyboardCandidateAssignedMessageReset.next();
    this.recordedCandidateNumber = '';
  }

  @HostListener('document:keydown', ['$event'])
  public async keyDown(event: KeyboardEvent): Promise<void> {
    if (this.isCtrlDown && event.key >= '0' && event.key <= '9') {
      this.recordedCandidateNumber += event.key;
      return;
    }

    if (event.key === 'Control') {
      this.recordedCandidateNumber = '';
      this.isCtrlDown = true;
    }
  }

  public toggleSelection(writeIn: MajorityElectionWriteInMapping): void {
    if (writeIn.selected) {
      writeIn.selected = false;
      this.selectedWriteInMappings = this.selectedWriteInMappings.filter(x => x.id !== writeIn.id);
      return;
    }

    writeIn.selected = true;
    this.selectedWriteInMappings = [writeIn, ...this.selectedWriteInMappings];
  }

  public addMapping(writeInCopy: MajorityElectionWriteInMapping, candidateMapping: CandidateWithMappings): void {
    if (this.readOnly) {
      return;
    }

    const writeIn = this.writeInMappingsById[writeInCopy.id];
    if (writeIn.selected) {
      this.toggleSelection(writeIn);
    }

    writeIn.target =
      mappingTargetsByCandidateId[candidateMapping.candidate.id] ??
      MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_CANDIDATE;

    writeIn.candidateId = candidateMapping.candidate.id;
    candidateMapping.totalWriteInVoteCount += writeIn.voteCount;
    candidateMapping.writeInMappings = [...candidateMapping.writeInMappings, writeIn];
    this.availableWriteInMappings = this.availableWriteInMappings.filter(x => x.id !== writeIn.id);
    this.writeInMappingsChange.emit(this.writeInMappings);
  }

  public removeMapping(writeInCopy: MajorityElectionWriteInMapping, candidateMapping: CandidateWithMappings): void {
    if (this.readOnly) {
      return;
    }

    const writeIn = this.writeInMappingsById[writeInCopy.id];

    candidateMapping.totalWriteInVoteCount -= writeIn.voteCount;
    candidateMapping.writeInMappings = candidateMapping.writeInMappings.filter(x => x.id !== writeIn.id);
    writeIn.target = MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_UNSPECIFIED;

    writeIn.candidateId = '';
    this.availableWriteInMappings = [writeIn, ...this.availableWriteInMappings];
    this.writeInMappingsChange.emit(this.writeInMappings);
    this.selectFirstAvailableWriteInMapping();
  }

  public resetAllMappings(): void {
    for (const candidateMapping of this.candidatesWithMappings) {
      for (const mapping of candidateMapping.writeInMappings) {
        this.removeMapping(mapping, candidateMapping);
      }
    }

    this.resetMappings.emit();
  }

  private updateAvailableWriteInMappings(): void {
    this.availableWriteInMappings = this.writeInMappings.filter(
      ({ target }) => target === MajorityElectionWriteInMappingTarget.MAJORITY_ELECTION_WRITE_IN_MAPPING_TARGET_UNSPECIFIED,
    );
    this.selectFirstAvailableWriteInMapping();
  }

  private selectFirstAvailableWriteInMapping(): void {
    for (const selectedWriteInMapping of this.selectedWriteInMappings) {
      this.toggleSelection(selectedWriteInMapping);
    }

    if (this.availableWriteInMappings.length > 0) {
      this.toggleSelection(this.availableWriteInMappings[0]);
    }
  }

  private updateCandidateMappings(): void {
    const candidatesById = groupBySingle(
      this.candidatesWithMappings,
      x => x.candidate.id,
      x => x,
    );

    if (this.writeInMappings === undefined) {
      this.writeInMappings = [];
    }

    for (const writeInMapping of this.writeInMappings) {
      if (!writeInMapping.candidateId) {
        const fakeCandidateId = candidateIdByMappingTarget[writeInMapping.target];
        if (!fakeCandidateId) {
          continue;
        }

        writeInMapping.candidateId = fakeCandidateId;
      }

      const candidate = candidatesById[writeInMapping.candidateId];
      candidate.writeInMappings.push(writeInMapping);
      candidate.totalWriteInVoteCount += writeInMapping.voteCount;
    }
  }

  private async loadCandidates(): Promise<void> {
    try {
      this.loadingCandidates = true;

      const candidatesResp =
        this.election.businessType === PoliticalBusinessType.POLITICAL_BUSINESS_TYPE_SECONDARY_MAJORITY_ELECTION
          ? await this.majorityElectionService.listCandidatesOfSecondaryElection(this.election.id)
          : await this.majorityElectionService.listCandidates(this.election.id);

      const candidates = [
        ...candidatesResp,
        this.createFakeCandidate(individualCandidateId, individualCandidateNr, 'MAJORITY_ELECTION.INDIVIDUAL'),
      ];

      // In elections with a single mandate, add an invalid ballot fake candidate, since empty votes and invalid votes are not possible.
      if (this.election.numberOfMandates === 1) {
        candidates.splice(-1, 0, this.createFakeCandidate(invalidCandidateId, invalidCandidateNr, 'MAJORITY_ELECTION.INVALID_BALLOT'));
      } else {
        candidates.push(this.createFakeCandidate(emptyCandidateId, emptyCandidateNr, 'MAJORITY_ELECTION.EMPTY_VOTES'));

        if (this.invalidVotes) {
          // add before other fake candidates
          candidates.splice(-2, 0, this.createFakeCandidate(invalidCandidateId, invalidCandidateNr, 'MAJORITY_ELECTION.INVALID_VOTES'));
        }
      }

      this.candidatesWithMappings = candidates.map(candidate => ({
        candidate,
        writeInMappings: [],
        totalWriteInVoteCount: 0,
      }));
      this.candidatesByNumber = groupBySingle(
        this.candidatesWithMappings,
        x => x.candidate.number,
        x => x,
      );
    } finally {
      this.loadingCandidates = false;
    }
  }

  private createFakeCandidate(id: string, candidateNumber: string, name: string): MajorityElectionCandidate {
    return {
      id,
      firstName: '',
      lastName: '',
      number: candidateNumber,
      description: '',
      party: '',
      politicalFirstName: '',
      politicalLastName: this.i18n.instant(name),
      position: -1,
    };
  }
}
