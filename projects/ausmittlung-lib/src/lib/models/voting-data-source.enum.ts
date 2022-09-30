/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

export enum VotingDataSource {
  Conventional,
  EVoting,
  Total,
}

export function dataSourceToPropertyPrefix(dataSource: VotingDataSource): string | undefined {
  switch (dataSource) {
    case VotingDataSource.Conventional:
      return 'conventionalSubTotal';
    case VotingDataSource.EVoting:
      return 'eVotingSubTotal';
    default:
      return undefined;
  }
}
