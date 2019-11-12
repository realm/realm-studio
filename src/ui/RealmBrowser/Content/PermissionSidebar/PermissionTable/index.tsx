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

import React from 'react';

import { Action, IPermission, IRole, Permissions } from '..';
import { SidebarBody, SidebarTable } from '../../../../reusable';

import { Header, IDescriptions } from './Header';

import './PermissionTable.scss';

interface IPermissionTableProps {
  actions: Action[];
  descriptions: IDescriptions;
  permissions: Permissions | null;
  onPermissionChange: (
    permission: IPermission,
    action: Action,
    enabled: boolean,
  ) => void;
  onRoleClick: (role: IRole) => void;
}

export const PermissionTable = ({
  actions,
  descriptions,
  permissions,
  onPermissionChange,
  onRoleClick,
}: IPermissionTableProps) => (
  <SidebarBody>
    <SidebarTable className="PermissionTable" size="sm">
      <Header actions={actions} descriptions={descriptions} />
      <tbody>
        {!permissions || permissions.length === 0 ? (
          <tr>
            <td
              className="PermissionTable__EmptyCell"
              colSpan={actions.length + 1}
            >
              Nobody can access this
            </td>
          </tr>
        ) : (
          permissions.map((permission, index) => (
            <tr key={index}>
              <td className="PermissionTable__RoleCell">
                <span
                  className="PermissionTable__RoleName"
                  onClick={() =>
                    permission.role ? onRoleClick(permission.role) : undefined
                  }
                >
                  {permission.role ? permission.role.name : '?'}
                </span>
              </td>
              {actions.map(action => (
                <td className="PermissionTable__ActionCell" key={action}>
                  <input
                    type="checkbox"
                    checked={permission[action]}
                    onChange={e => {
                      onPermissionChange(permission, action, e.target.checked);
                    }}
                  />
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </SidebarTable>
  </SidebarBody>
);
