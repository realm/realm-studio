////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as React from 'react';

import { SidebarTitle } from '../../../reusable';

import { Action, IPermission, IRole } from '.';
import { PermissionTable } from './PermissionTable';

interface IRealmSectionProps {
  permissions: Realm.Collection<IPermission & Realm.Object>;
  onPermissionChange: (
    permission: IPermission,
    action: Action,
    enabled: boolean,
  ) => void;
  onRoleClick: (role: IRole) => void;
}

export const RealmSection = ({
  onPermissionChange,
  onRoleClick,
  permissions,
}: IRealmSectionProps) => (
  <React.Fragment>
    <SidebarTitle size="md">Realm permissions</SidebarTitle>
    <PermissionTable
      permissions={permissions}
      actions={['canRead', 'canUpdate', 'canModifySchema', 'canSetPermissions']}
      descriptions={{
        canRead:
          'This indicates that a user can see anything in the Realm at all (though not necessarily everything). If the user does not have this privilege, the Realm file will appear empty.',
        canUpdate:
          'This indicates that the user can make updates in the Realm (though not necessarily to any object in the file). If the user does not have this privilege, all changes they attempt to make in the Realm file will be rejected by the server.',
        canModifySchema:
          'The user is allowed to add classes and properties in the Realm file.',
        canSetPermissions:
          'The user is allowed to change Realm-level permissions. Note that a user with the SetPermissions privilege can never give other users higher privileges than they themselves have.',
      }}
      onPermissionChange={onPermissionChange}
      onRoleClick={onRoleClick}
    />
  </React.Fragment>
);
