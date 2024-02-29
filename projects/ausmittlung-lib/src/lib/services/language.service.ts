/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // Currently hardcoded, since users cannot switch the language and only german is supported
  public currentLanguage: string = 'de';
}
