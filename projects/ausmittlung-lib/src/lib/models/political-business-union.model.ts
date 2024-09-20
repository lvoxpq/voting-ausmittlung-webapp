/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  PoliticalBusinessUnion as PoliticalBusinessUnionProto,
  PoliticalBusinessUnionType,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/political_business_union_pb';
import { SimplePoliticalBusiness } from './political-business.model';

export { PoliticalBusinessUnionProto };
export { PoliticalBusinessUnionType };

export interface PoliticalBusinessUnion extends Omit<PoliticalBusinessUnionProto.AsObject, 'politicalBusinessesList'> {
  politicalBusinesses: SimplePoliticalBusiness[];
}
