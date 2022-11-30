/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

// Builds the scope for the authentication config.
// The apps scope is required to satisfy a secure connect constraint,
// so the backend is able to read the roles of both apps.
import { AUDIENCE_CLIENTID_PREFIX, DEFAULT_SCOPE } from '@abraxas/base-components';

export function buildScope(clientIdErfassung: string, clientIdMonitoring: string): string {
  return (
    DEFAULT_SCOPE + ' offline_access ' + AUDIENCE_CLIENTID_PREFIX + clientIdErfassung + ' ' + AUDIENCE_CLIENTID_PREFIX + clientIdMonitoring
  );
}
