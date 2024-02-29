/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { SimplePoliticalBusiness, SimplePoliticalBusinessProto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PoliticalBusinessService {
  public static mapToPoliticalBusiness(business: SimplePoliticalBusinessProto): SimplePoliticalBusiness {
    const obj = business.toObject();
    return {
      ...obj,
      numberOfMandates: obj.numberOfMandates?.value,
    };
  }
}
