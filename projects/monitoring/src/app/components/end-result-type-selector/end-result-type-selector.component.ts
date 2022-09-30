/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { RadioButton } from '@abraxas/base-components';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-end-result-type-selector',
  templateUrl: './end-result-type-selector.component.html',
  styleUrls: ['./end-result-type-selector.component.scss'],
})
export class EndResultTypeSelectorComponent {
  @Input()
  public finalized: boolean = false;

  @Output()
  public finalizedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public readonly items: RadioButton[];

  constructor(private readonly i18n: TranslateService) {
    this.items = [
      {
        value: false,
        disabled: true,
        displayText: this.i18n.instant('END_RESULTS.NOT_FINALIZED'),
      },
      {
        value: true,
        disabled: true,
        displayText: this.i18n.instant('END_RESULTS.FINALIZED'),
      },
    ];
  }

  @Input()
  public set disabled(d: boolean) {
    for (const item of this.items) {
      item.disabled = d;
    }
  }

  public setFinalized(f: boolean): void {
    if (this.finalized !== f) {
      this.finalizedChange.emit(f);
    }
  }
}
