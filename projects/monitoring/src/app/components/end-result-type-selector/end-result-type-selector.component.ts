/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { RadioButton } from '@abraxas/base-components';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-end-result-type-selector',
  templateUrl: './end-result-type-selector.component.html',
  styleUrls: ['./end-result-type-selector.component.scss'],
})
export class EndResultTypeSelectorComponent implements OnInit {
  @Input()
  public finalized: boolean = false;

  @Input()
  public finalizedLabel: string = 'END_RESULTS.FINALIZED';

  @Input()
  public notFinalizedLabel: string = 'END_RESULTS.NOT_FINALIZED';

  @Input()
  public disabled: boolean = true;

  @Output()
  public finalizedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public items: RadioButton[] = [];

  constructor(private readonly i18n: TranslateService) {}

  public ngOnInit(): void {
    this.items = [
      {
        value: false,
        disabled: true,
        displayText: this.i18n.instant(this.notFinalizedLabel),
      },
      {
        value: true,
        disabled: true,
        displayText: this.i18n.instant(this.finalizedLabel),
      },
    ];

    for (const item of this.items) {
      item.disabled = this.disabled;
    }
  }

  public setFinalized(f: boolean): void {
    if (this.finalized !== f) {
      this.finalizedChange.emit(f);
    }
  }
}
