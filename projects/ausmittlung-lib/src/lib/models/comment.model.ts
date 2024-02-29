/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Comment as CommentProto } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/comment_pb';
import { User } from './user.model';

export { CommentProto };
export interface Comment {
  content: string;
  createdAt: Date;
  createdByMonitoringAuthority: boolean;
  createdBy: User;
}
