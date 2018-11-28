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
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import * as ros from '../../../../services/ros';

import { ISelection } from '..';
import { SidebarBody, SidebarControls, SidebarTitle } from '../../../reusable';

import { AccountsTable } from './AccountsTable';
import { MetadataTable } from './MetadataTable';
import { UsersRealmsTable } from './UsersRealmsTable';

import './UserSidebar.scss';
import { UserStatusRoleTable } from './UserStatusRoleTable';

export interface IUserSidebarContentProps {
  onChangePassword: () => void;
  onDeletion: () => void;
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
  onRoleChanged: (role: ros.UserRole) => void;
  roleDropdownOpen: boolean;
  selection: ISelection;
  toggleRoleDropdown: () => void;
  onStatusChanged: (status: ros.UserStatus) => void;
  statusDropdownOpen: boolean;
  toggleStatusDropdown: () => void;
}

export const UserSidebarContent = ({
  onChangePassword,
  onDeletion,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
  onRoleChanged,
  roleDropdownOpen,
  selection,
  toggleRoleDropdown,
  onStatusChanged,
  statusDropdownOpen,
  toggleStatusDropdown,
}: IUserSidebarContentProps) => {
  return (
    <React.Fragment>
      <SidebarTitle>{selection.user.userId}</SidebarTitle>
      <SidebarBody grow={0}>
        <UserStatusRoleTable
          selection={selection}
          roleDropdownOpen={roleDropdownOpen}
          toggleRoleDropdown={toggleRoleDropdown}
          onRoleChanged={onRoleChanged}
          onStatusChanged={onStatusChanged}
          statusDropdownOpen={statusDropdownOpen}
          toggleStatusDropdown={toggleStatusDropdown}
        />
      </SidebarBody>
      <SidebarBody className="UserSidebar__Tables">
        <AccountsTable accounts={selection.user.accounts} />
        <MetadataTable
          metadatas={selection.user.metadata}
          onMetadataAppended={onMetadataAppended}
          onMetadataChanged={onMetadataChanged}
          onMetadataDeleted={onMetadataDeleted}
        />
        <UsersRealmsTable realms={selection.realms} />
      </SidebarBody>
      <SidebarControls>
        <Button size="sm" onClick={() => onChangePassword()}>
          Change password
        </Button>
        <Button size="sm" color="danger" onClick={() => onDeletion()}>
          Delete
        </Button>
      </SidebarControls>
    </React.Fragment>
  );
};
