/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Input } from '@angular/core';
import { BallotQuestionResult, TieBreakQuestionResult } from '../../../../models';

@Component({
  selector: 'vo-ausm-contest-vote-detail-question',
  templateUrl: './contest-vote-detail-question.component.html',
  styleUrls: ['./contest-vote-detail-question.component.scss'],
})
export class ContestVoteDetailQuestionComponent {
  @Input()
  public isTieBreakQuestion: boolean = false;

  @Input()
  public ballotNumberOfQuestions: number = 1;

  @Input()
  public result!: BallotQuestionResult | TieBreakQuestionResult;

  @Input()
  public eVoting: boolean = false;

  @Input()
  public readonly: boolean = true;

  public updateTotal(): void {
    const conventionalSubTotal = this.result.conventionalSubTotal;
    const eVotingSubTotal = this.result.eVotingSubTotal;

    this.result.totalCountOfAnswer1 = +(conventionalSubTotal.totalCountOfAnswer1 ?? 0) + +eVotingSubTotal.totalCountOfAnswer1;
    this.result.totalCountOfAnswer2 = +(conventionalSubTotal.totalCountOfAnswer2 ?? 0) + +eVotingSubTotal.totalCountOfAnswer2;
    this.result.totalCountOfAnswerUnspecified =
      +(conventionalSubTotal.totalCountOfAnswerUnspecified ?? 0) + +eVotingSubTotal.totalCountOfAnswerUnspecified;
  }
}
