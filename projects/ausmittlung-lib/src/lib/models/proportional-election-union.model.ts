/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ProportionalElectionUnionList as ProportionalElectionUnionListProto } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/proportional_election_union_pb';

export { ProportionalElectionUnionListProto };

export type ProportionalElectionUnionList = ProportionalElectionUnionListProto.AsObject;
