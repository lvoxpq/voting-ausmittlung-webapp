import { ContestSummaries } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/contest_pb';
import { mock } from './defaults';

const contestSummariesResponse = new ContestSummaries();

export const contestMock = {
  listSummaries: mock(/\/abraxas\.voting\.ausmittlung\.v1\.ContestService\/ListSummaries$/, contestSummariesResponse),
};
