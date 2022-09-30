/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  ValidationOverview as ValidationOverviewProto,
  ValidationResult as ValidationResultProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/validation_pb';
import { Validation } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/validation_pb';

export { Validation, ValidationOverviewProto, ValidationResultProto };

export interface ValidationResult {
  validation: Validation;
  isValid: boolean;
  isOptional: boolean;
  data?: any;
  translationId: string;
  translationListItemsCount?: number;
}

export interface ValidationOverview {
  requiredValidationResults: ValidationResult[];
  optionalValidationResults: ValidationResult[];
  isValid: boolean;
}
