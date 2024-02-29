/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthenticationConfig, AuthorizationConfig, UserConfig } from '@abraxas/base-components';
import { TenantConfig } from '@abraxas/base-components/lib/services/models/tenant-config.model';
import { Environments, GrpcEnvironment } from '@abraxas/voting-lib';

export interface Environment extends TenantConfig, UserConfig, AuthorizationConfig, GrpcEnvironment {
  production: boolean;
  hmr: boolean;
  env: Environments;
  authenticationConfig: AuthenticationConfig & Required<Pick<AuthenticationConfig, 'clientId' | 'issuer' | 'scope'>>;
  grpcApiEndpoint: string;
  restApiEndpoint: string;
  votingBasisWebApp: string;
}
