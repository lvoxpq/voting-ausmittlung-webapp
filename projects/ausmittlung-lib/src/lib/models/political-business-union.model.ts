/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  PoliticalBusinessUnion as PoliticalBusinessUnionProto,
  PoliticalBusinessUnionType,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/political_business_union_pb';

export { PoliticalBusinessUnionProto };
export { PoliticalBusinessUnionType };

export type PoliticalBusinessUnion = PoliticalBusinessUnionProto.AsObject;
