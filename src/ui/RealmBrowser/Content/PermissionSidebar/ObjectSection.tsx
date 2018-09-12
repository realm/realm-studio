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

import { IPermission } from '.';
import { ActionBadge } from './ActionBadge';
import { PermissionTable } from './PermissionTable';

interface IObjectSectionProps {
  getPermissions: (object: any) => Realm.Collection<IPermission & Realm.Object>;
  hasPermissionColumn: boolean;
  objects: Array<any & Realm.Object>;
}

export const ObjectSection = ({
  objects,
  getPermissions,
  hasPermissionColumn,
}: IObjectSectionProps) => (
  <React.Fragment>
    <SidebarTitle size="md">Object permissions</SidebarTitle>
    {hasPermissionColumn ? (
      objects.length === 0 ? (
        <SidebarBody>No object selected</SidebarBody>
      ) : objects.length === 1 ? (
        <PermissionTable permissions={getPermissions(objects[0])}>
          {permission => (
            <React.Fragment>
              <ActionBadge
                permission={permission}
                action="canRead"
                description="This indicates that the object is visible to the user. If the user does not have this privilege, the object will not appear in query results."
              />
              <ActionBadge
                permission={permission}
                action="canUpdate"
                description="This indicates that the object is writable by the user. The user may change any property of the object, except the ACL property if one exists."
              />
              <ActionBadge
                permission={permission}
                action="canDelete"
                description="The user may delete the object."
              />
              <ActionBadge
                permission={permission}
                action="canSetPermissions"
                description="The user is allowed to modify the ACL property of the object, if one exists."
              />
            </React.Fragment>
          )}
        </PermissionTable>
      ) : (
        <SidebarBody>{objects.length} objects selected</SidebarBody>
      )
    ) : (
      <SidebarBody>This class has no object level permissions</SidebarBody>
    )}
  </React.Fragment>
);
