/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  MajorityElectionContestWriteInMappings as MajorityElectionContestWriteInMappingsProto,
  MajorityElectionWriteInMapping as MajorityElectionWriteInMappingProto,
  MajorityElectionWriteInMappings as MajorityElectionWriteInMappingsProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/majority_election_write_in_pb';
import {
  ResultImport as ResultImportProto,
  ResultImportChange as ResultImportChangeProto,
} from '@abraxas/voting-ausmittlung-service-proto/grpc/models/results_pb';
import { MajorityElectionWriteInMappingTarget } from '@abraxas/voting-ausmittlung-service-proto/grpc/shared/majority_election_write_in_pb';
import { SimplePoliticalBusiness } from './political-business.model';

export interface ResultImport extends Omit<ResultImportProto.AsObject, 'started'> {
  started: Date;
}

export {
  MajorityElectionWriteInMappingTarget,
  MajorityElectionContestWriteInMappingsProto,
  MajorityElectionWriteInMappingsProto,
  MajorityElectionWriteInMappingProto,
  ResultImportChangeProto,
};

export interface MajorityElectionWriteInMappings {
  election: SimplePoliticalBusiness;
  invalidVotes: boolean;
  writeInMappings: MajorityElectionWriteInMapping[];
}

export interface MajorityElectionWriteInMapping extends MajorityElectionWriteInMappingProto.AsObject {
  selected: boolean;
}

export interface ContestMajorityElectionWriteInMappings {
  importId: string;
  writeInGroups: MajorityElectionWriteInMappings[];
}
