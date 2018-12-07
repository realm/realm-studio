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
import * as Realm from 'realm';

import { SidebarBody, SidebarTitle } from '../../../reusable';

import { Action, IPermission, IRole, Permissions } from '.';
import { PermissionTable } from './PermissionTable';

interface IObjectSectionProps {
  getPermissions: (object: any) => Permissions | null;
  hasPermissionProperty: boolean;
  objects: Array<any & Realm.Object>;
  onPermissionChange: (
    permission: IPermission,
    action: Action,
    enabled: boolean,
  ) => void;
  onRoleClick: (role: IRole) => void;
}

export const ObjectSection = ({
  objects,
  getPermissions,
  hasPermissionProperty,
  onPermissionChange,
  onRoleClick,
}: IObjectSectionProps) => (
  <React.Fragment>
    <SidebarTitle size="md">Object permissions</SidebarTitle>
    {hasPermissionProperty ? (
      objects.length === 0 ? (
        <SidebarBody>No object selected</SidebarBody>
      ) : objects.length === 1 ? (
        <PermissionTable
          permissions={getPermissions(objects[0])}
          actions={['canRead', 'canUpdate', 'canDelete', 'canSetPermissions']}
          descriptions={{
            canRead:
              'This indicates that the object is visible to the user. If the user does not have this privilege, the object will not appear in query results.',
            canUpdate:
              'This indicates that the object is writable by the user. The user may change any property of the object, except the ACL property if one exists.',
            canDelete: 'The user may delete the object.',
            canSetPermissions:
              'The user is allowed to modify the ACL property of the object, if one exists.',
          }}
          onPermissionChange={onPermissionChange}
          onRoleClick={onRoleClick}
        />
      ) : (
        <SidebarBody>{objects.length} objects selected</SidebarBody>
      )
    ) : (
      <SidebarBody>
        This class has no object level permission property: Every user with read
        access to the class as a whole can read these objects and every user
        with update access can update all these objects.
      </SidebarBody>
    )}
  </React.Fragment>
);
