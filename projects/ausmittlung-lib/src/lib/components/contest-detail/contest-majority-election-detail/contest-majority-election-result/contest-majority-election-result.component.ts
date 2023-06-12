/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { MajorityElectionResult, MajorityElectionWriteInMapping, SecondaryMajorityElectionResult } from '../../../../models';
import { adjustWriteIns, resetWriteIns } from '../../../../services/utils/write-ins-mapping.utils';

@Component({
  selector: 'vo-ausm-contest-majority-election-result',
  templateUrl: './contest-majority-election-result.component.html',
  styleUrls: ['./contest-majority-election-result.component.scss'],
})
export class ContestMajorityElectionResultComponent {
  public eVotingValue: boolean = false;

  @Input()
  public accountedBallots!: number;

  @Input()
  public showElectionHeader: boolean = false;

  @Input()
  public result!: MajorityElectionResult | SecondaryMajorityElectionResult;

  @Input()
  public buttonsTemplate?: TemplateRef<HTMLElement>;

  @ViewChild('candidateResultsContainer', { static: true })
  public candidateResultsContainer!: ElementRef;

  @Input()
  public set eVoting(v: boolean) {
    this.eVotingValue = v;

    // variable workaround due to angular bug https://github.com/angular/angular/issues/28897
    this.candidateResultsContainer.nativeElement.style.setProperty('--candidate-results-column-count', v ? 6 : 4);
  }

  @Input()
  public set mappedWriteIns(mappings: MajorityElectionWriteInMapping[] | undefined) {
    if (!mappings) {
      return;
    }

    resetWriteIns(this.result);
    adjustWriteIns(this.result, mappings);
  }
}
