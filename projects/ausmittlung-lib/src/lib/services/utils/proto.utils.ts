/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Int32Value } from 'google-protobuf/google/protobuf/wrappers_pb';

export function createInt32Value(v: number | undefined): Int32Value | undefined {
  if (v === undefined || v === null) {
    return;
  }

  const proto = new Int32Value();
  proto.setValue(v);
  return proto;
}
