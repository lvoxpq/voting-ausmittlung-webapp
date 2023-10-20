/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Component, Input } from '@angular/core';
import { ValidationSummary } from '../../models';

@Component({
  selector: 'vo-ausm-validation-summary',
  templateUrl: './validation-summary.component.html',
})
export class ValidationSummaryComponent {
  @Input()
  public summary!: ValidationSummary;
}
