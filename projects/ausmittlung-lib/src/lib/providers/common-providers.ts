/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DatePipe, DecimalPipe } from '@angular/common';
import { Provider } from '@angular/core';

export function getCommonProviders(): Provider[] {
  // common providers for AppModule
  // pipes are required to pre-format data for translations.
  return [DecimalPipe, DatePipe];
}
