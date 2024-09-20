/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { PoliticalBusinessUnion } from '../models';
import { PoliticalBusinessUnionProto } from '../models/political-business-union.model';
import { PoliticalBusinessService } from './political-business.service';

@Injectable({
  providedIn: 'root',
})
export class PoliticalBusinessUnionService {
  public static mapToPoliticalBusinessUnion(union: PoliticalBusinessUnionProto): PoliticalBusinessUnion {
    return {
      ...union.toObject(),
      politicalBusinesses: union.getPoliticalBusinessesList().map(x => PoliticalBusinessService.mapToPoliticalBusiness(x)),
    };
  }
}
