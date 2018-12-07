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

interface IClassSectionProps {
  name: string;
  onPermissionChange: (
    permission: IPermission,
    action: Action,
    enabled: boolean,
  ) => void;
  onRoleClick: (role: IRole) => void;
  permissions: Realm.Collection<IPermission & Realm.Object>;
}

export const ClassSection = ({
  name,
  onPermissionChange,
  onRoleClick,
  permissions,
}: IClassSectionProps) => (
  <React.Fragment>
    <SidebarTitle size="md">{name} class permissions</SidebarTitle>
    <PermissionTable
      permissions={permissions}
      actions={[
        'canCreate',
        'canRead',
        'canUpdate',
        'canDelete',
        'canQuery',
        'canSetPermissions',
        'canModifySchema',
      ]}
      descriptions={{
        canCreate: 'The user may create new objects of this class.',
        canRead:
          'This indicates that a user can see objects of this class, though not necessarily all objects of this class. If the user does not have this privilege, they will not be able to see any objects of this class.',
        canUpdate:
          'This indicates that the user can make updates to objects of this class, though not necessarily all objects of this class.',
        canDelete:
          'The user may delete objects of this class, if granted on the object level.',
        canQuery:
          'This indicates that the user is allowed to make server-side global queries on objects of this class. Note that local (client-side) queries are always allowed.',
        canSetPermissions:
          'The user is allowed to change class-level permissions on this class.',
        canModifySchema:
          'The user can add properties to this class. Deleting and renaming fields is currently not supported by the Realm Object Server.',
      }}
      onPermissionChange={onPermissionChange}
      onRoleClick={onRoleClick}
    />
  </React.Fragment>
);
