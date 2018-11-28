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

import './UserStatusRoleTable.scss';

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
  <table className="UserStatusRoleTable">
    <tbody>
      <tr>
        <td>Role</td>
        <td className="UserStatusRoleTable__ControlsCell">
          <ButtonDropdown
            size="sm"
            isOpen={roleDropdownOpen}
            toggle={toggleRoleDropdown}
          >
            <DropdownToggle caret={true}>
              {selection.user.isAdmin ? 'Administrator' : 'Regular user'}
            </DropdownToggle>
            <DropdownMenu right={true}>
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
        <td>
          Status{' '}
          {/*<a href="https://docs.realm.io/platform/" target="_blank">
            <i className="fa fa-question-circle" />
          </a>*/}
        </td>
        <td className="UserStatusRoleTable__ControlsCell">
          <ButtonDropdown
            size="sm"
            isOpen={statusDropdownOpen}
            toggle={toggleStatusDropdown}
          >
            <DropdownToggle caret={true}>
              {ros.humanizeUserStatus(selection.user.status)}
            </DropdownToggle>
            <DropdownMenu right={true}>
              {[ros.UserStatus.active, ros.UserStatus.suspended].map(status => {
                return (
                  <DropdownItem
                    key={status}
                    onClick={() => onStatusChanged(status)}
                  >
                    {ros.humanizeUserStatus(status)}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </ButtonDropdown>
        </td>
      </tr>
    </tbody>
  </table>
);
