/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ContactPerson } from '../../models';

@Component({
  selector: 'vo-ausm-contact-person-edit',
  templateUrl: './contact-person-edit.component.html',
  styleUrls: ['./contact-person-edit.component.scss'],
})
export class ContactPersonEditComponent {
  @Input()
  public contactPerson!: ContactPerson;

  @Input()
  public readonly: boolean = false;
}
