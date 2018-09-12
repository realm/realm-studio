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

import { Action, IPermission } from '..';
import { SidebarBody, SidebarTable } from '../../../../reusable';

import './PermissionTable.scss';

interface IPermissionTableProps {
  actions: Action[];
  children: (permission: IPermission & Realm.Object) => React.ReactNode;
  permissions: Realm.Collection<IPermission & Realm.Object>;
}

export const PermissionTable = ({
  actions,
  children,
  permissions,
}: IPermissionTableProps) => (
  <SidebarBody>
    <SidebarTable className="PermissionTable">
      <tbody>
        {permissions.map((permission, index) => (
          <tr key={index}>
            <td className="PermissionTable__Row">
              <div className="PermissionTable__Role">
                {permission.role ? permission.role.name : '?'}
              </div>
              <div className="PermissionTable__Actions">
                {children(permission)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </SidebarTable>
  </SidebarBody>
);
