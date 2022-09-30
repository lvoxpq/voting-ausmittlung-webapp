/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import { RoleService as IamRoleService } from '@abraxas/base-components';
import { Injectable } from '@angular/core';
import { RoleService as BaseRoleService } from 'ausmittlung-lib';
import { Observable } from 'rxjs';
import { Roles } from '../../../models/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseRoleService {
  constructor(private readonly roles: IamRoleService) {
    super();
  }

  public get isErfassungElectionAdmin(): Observable<boolean> {
    return this.roles.hasRole([Roles.ElectionAdmin]);
  }

  public get isErfassungCreator(): Observable<boolean> {
    return this.roles.hasRole([Roles.Creator]);
  }
}
