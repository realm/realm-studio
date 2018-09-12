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

import { IPermission } from '.';
import { ActionBadge } from './ActionBadge';
import { PermissionTable } from './PermissionTable';

interface IClassSectionProps {
  permissions: Realm.Collection<IPermission & Realm.Object>;
}

export const ClassSection = ({ permissions }: IClassSectionProps) => (
  <React.Fragment>
    <SidebarTitle size="md">Class permissions</SidebarTitle>
    <PermissionTable permissions={permissions}>
      {permission => (
        <React.Fragment>
          <ActionBadge
            permission={permission}
            action="canRead"
            description="This indicates that a user can see objects of this class, though not necessarily all objects of this class. If the user does not have this privilege, they will not be able to see any objects of this class."
          />
          <ActionBadge
            permission={permission}
            action="canUpdate"
            description="This indicates that the user can make updates to objects of this class, though not necessarily all objects of this class."
          />
          <ActionBadge
            permission={permission}
            action="canCreate"
            description="The user may create new objects of this class."
          />
          <ActionBadge
            permission={permission}
            action="canQuery"
            description="This indicates that the user is allowed to make server-side global queries on objects of this class. Note that local (client-side) queries are always allowed."
          />
          <ActionBadge
            permission={permission}
            action="canSetPermissions"
            description="The user is allowed to change class-level permissions on this class."
          />
        </React.Fragment>
      )}
    </PermissionTable>
  </React.Fragment>
);
