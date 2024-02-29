/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  Authority as AuthorityProto,
  CountingCircle as CountingCircleProto,
  CountingCircleElectorate as CountingCircleElectorateProto,
  CountingCircleResultState,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/counting_circle_pb';

export { AuthorityProto, CountingCircleProto, CountingCircleElectorateProto, CountingCircleResultState };

export type CountingCircle = CountingCircleProto.AsObject;
export type Authority = AuthorityProto.AsObject;
export type CountingCircleElectorate = CountingCircleElectorateProto.AsObject;

export interface StateChange {
  oldState: CountingCircleResultState;
  newState: CountingCircleResultState;
  comment: string;
}
