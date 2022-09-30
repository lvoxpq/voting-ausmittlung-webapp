/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

// can be removed with ng 9
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[voAusmBindCssVar]',
})
export class BindCssVarDirective implements OnChanges {
  @Input('voAusmBindCssVar')
  public name: string = '';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('voAusmBindCssVarValue')
  public cssValue: string | number = '';

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  public ngOnChanges(): void {
    this.host.nativeElement.style.setProperty('--' + this.name, '' + this.cssValue);
  }
}
