/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  PoliticalBusinessType,
  SimplePoliticalBusiness as SimplePoliticalBusinessProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/political_business_pb';
import { MajorityElection } from './majority-election.model';
import { ProportionalElection } from './proportional-election.model';
import { Vote } from './vote.model';

export { PoliticalBusinessType, SimplePoliticalBusinessProto };

export type PoliticalBusiness = (Vote | ProportionalElection | MajorityElection) & {
  politicalBusinessType: PoliticalBusinessType;
};

export interface SimplePoliticalBusiness extends Omit<SimplePoliticalBusinessProto.AsObject, 'numberOfMandates'> {
  numberOfMandates?: number;
}
