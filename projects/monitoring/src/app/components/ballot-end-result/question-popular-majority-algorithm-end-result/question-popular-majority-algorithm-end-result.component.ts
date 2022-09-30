/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Input } from '@angular/core';
import { BallotQuestionEndResult, TieBreakQuestionEndResult } from 'ausmittlung-lib';

@Component({
  selector: 'app-question-popular-majority-algorithm-end-result',
  templateUrl: './question-popular-majority-algorithm-end-result.component.html',
  styleUrls: ['./question-popular-majority-algorithm-end-result.component.scss'],
})
export class QuestionPopularMajorityAlgorithmEndResultComponent {
  @Input()
  public isTieBreakQuestion: boolean = false;

  @Input()
  public ballotNumberOfQuestions: number = 1;

  @Input()
  public eVoting: boolean = false;

  @Input()
  public endResult!: BallotQuestionEndResult | TieBreakQuestionEndResult;
}
