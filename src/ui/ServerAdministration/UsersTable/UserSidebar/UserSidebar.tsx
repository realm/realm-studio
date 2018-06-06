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
import { Sidebar } from '../../shared/Sidebar';

import { IUserSidebarContainerProps } from '.';
import { UserSidebarCard } from './UserSidebarCard';

import './UserSidebar.scss';

export interface IUserSidebarProps extends IUserSidebarContainerProps {
  onChangePassword: () => void;
  onDeletion: () => void;
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
  onRoleChanged: (role: ros.UserRole) => void;
  onToggle: () => void;
  roleDropdownOpen: boolean;
  selection: ISelection | null;
  toggleRoleDropdown: () => void;
}

export const UserSidebar = ({
  isOpen,
  onChangePassword,
  onDeletion,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
  onRoleChanged,
  onToggle,
  roleDropdownOpen,
  selection,
  toggleRoleDropdown,
}: IUserSidebarProps) => {
  // We need this type-hax because we don't want the IRealmFile to have a isValid method when it gets created
  const currentUser = selection
    ? ((selection.user as any) as ros.IUser & Realm.Object)
    : null;
  return (
    <Sidebar className="UserSidebar" isOpen={isOpen} onToggle={onToggle}>
      {selection &&
        currentUser &&
        currentUser.isValid() && (
          <UserSidebarCard
            onChangePassword={onChangePassword}
            onDeletion={onDeletion}
            onMetadataAppended={onMetadataAppended}
            onMetadataChanged={onMetadataChanged}
            onMetadataDeleted={onMetadataDeleted}
            onRoleChanged={onRoleChanged}
            roleDropdownOpen={roleDropdownOpen}
            selection={selection}
            toggleRoleDropdown={toggleRoleDropdown}
          />
        )}
    </Sidebar>
  );
};
