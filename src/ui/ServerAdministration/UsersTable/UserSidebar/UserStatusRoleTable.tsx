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

import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { ISelection } from '..';
import * as ros from '../../../../services/ros';

export interface IUserStatusRoleTableProps {
  selection: ISelection;
  roleDropdownOpen: boolean;
  toggleRoleDropdown: () => void;
  onRoleChanged: (role: ros.UserRole) => void;
  onStatusChanged: (status: ros.UserStatus) => void;
  statusDropdownOpen: boolean;
  toggleStatusDropdown: () => void;
}

export const UserStatusRoleTable = ({
  selection,
  roleDropdownOpen,
  toggleRoleDropdown,
  onRoleChanged,
  onStatusChanged,
  statusDropdownOpen,
  toggleStatusDropdown,
}: IUserStatusRoleTableProps) => (
  <table>
    <tbody>
      <tr>
        <td>Role</td>
        <td>
          <ButtonDropdown isOpen={roleDropdownOpen} toggle={toggleRoleDropdown}>
            <DropdownToggle caret={true}>
              {selection.user.isAdmin ? 'Administrator' : 'Regular user'}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => onRoleChanged(ros.UserRole.Administrator)}
              >
                Administrator
              </DropdownItem>
              <DropdownItem onClick={() => onRoleChanged(ros.UserRole.Regular)}>
                Regular user
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </td>
      </tr>
      <tr>
        <td>Status</td>
        <td>
          <ButtonDropdown
            isOpen={statusDropdownOpen}
            toggle={toggleStatusDropdown}
          >
            <DropdownToggle caret={true}>
              {humanizeUserStatus(selection.user.status)}
            </DropdownToggle>
            <DropdownMenu>
              {[ros.UserStatus.active, ros.UserStatus.blacklisted].map(
                status => {
                  return (
                    <DropdownItem
                      key={status}
                      onClick={() => onStatusChanged(status)}
                    >
                      {humanizeUserStatus(status)}
                    </DropdownItem>
                  );
                },
              )}
            </DropdownMenu>
          </ButtonDropdown>
        </td>
      </tr>
    </tbody>
  </table>
);

function humanizeUserStatus(userStatus: ros.UserStatus | string) {
  switch (userStatus) {
    case ros.UserStatus.blacklisted:
      return 'Blacklisted';
    case ros.UserStatus.active:
    case '':
    case null:
    case undefined:
      // We don't have a migration, so assume that every User that doesn't have a status set is Active
      return 'Active';
    default:
      return userStatus;
  }
}
