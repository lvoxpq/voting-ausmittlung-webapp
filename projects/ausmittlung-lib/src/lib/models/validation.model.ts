/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  ValidationSummary as ValidationSummaryProto,
  ValidationSummaries as ValidationSummariesProto,
  ValidationResult as ValidationResultProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/validation_pb';
import { Validation } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/validation_pb';

export { Validation, ValidationSummaryProto, ValidationResultProto, ValidationSummariesProto };

export interface ValidationSummaries {
  summaries: ValidationSummary[];
  isValid: boolean;
}

export interface ValidationResult {
  validation: Validation;
  isValid: boolean;
  isOptional: boolean;
  data?: any;
  translationId: string;
  translationListItemsCount?: number;
}

export interface ValidationSummary {
  title: string;
  requiredValidationResults: ValidationResult[];
  optionalValidationResults: ValidationResult[];
  isValid: boolean;
}
