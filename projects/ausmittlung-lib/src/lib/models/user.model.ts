/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { User as UserProto } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/user_pb';

export { UserProto };
export type User = UserProto.AsObject;
