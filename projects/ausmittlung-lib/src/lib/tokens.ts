/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { InjectionToken } from '@angular/core';

export const VOTING_BASIS_WEBAPP_URL: InjectionToken<string> = new InjectionToken<string>('voting basis webapp url');
export const VOTING_AUSMITTLUNG_MONITORING_WEBAPP_URL: InjectionToken<string> = new InjectionToken<string>(
  'voting ausmittlung monitoring webapp url',
);
