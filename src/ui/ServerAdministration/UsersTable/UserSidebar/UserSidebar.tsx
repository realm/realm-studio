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

import * as ros from '../../../../services/ros';

import { ISelection } from '..';
import { Sidebar } from '../../../reusable';

import { IUserSidebarContainerProps } from '.';
import { UserSidebarContent } from './UserSidebarContent';

import './UserSidebar.scss';

export interface IUserSidebarProps extends IUserSidebarContainerProps {
  onChangePassword: () => void;
  onClose: () => void;
  onDeletion: () => void;
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
  onRoleChanged: (role: ros.UserRole) => void;
  roleDropdownOpen: boolean;
  selection: ISelection | null;
  toggleRoleDropdown: () => void;
  onStatusChanged: (status: ros.UserStatus) => void;
  statusDropdownOpen: boolean;
  toggleStatusDropdown: () => void;
}

export const UserSidebar = ({
  isOpen,
  onChangePassword,
  onClose,
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
}: IUserSidebarProps) => {
  // We need this type-hax because we don't want the IRealmFile to have a isValid method when it gets created
  const currentUser = selection
    ? ((selection.user as any) as ros.IUser & Realm.Object)
    : null;
  return (
    <Sidebar
      className="UserSidebar"
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      initialWidth={300}
    >
      {selection && currentUser && currentUser.isValid() && (
        <UserSidebarContent
          onChangePassword={onChangePassword}
          onDeletion={onDeletion}
          onMetadataAppended={onMetadataAppended}
          onMetadataChanged={onMetadataChanged}
          onMetadataDeleted={onMetadataDeleted}
          onRoleChanged={onRoleChanged}
          roleDropdownOpen={roleDropdownOpen}
          selection={selection}
          toggleRoleDropdown={toggleRoleDropdown}
          onStatusChanged={onStatusChanged}
          statusDropdownOpen={statusDropdownOpen}
          toggleStatusDropdown={toggleStatusDropdown}
        />
      )}
    </Sidebar>
  );
};
