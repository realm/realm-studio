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
import { Column } from 'react-virtualized';
import { Button } from 'reactstrap';

import { IAccount, RealmFile, User, UserRole } from '../../../services/ros';

import {
  FilterableTable,
  IFilterableTableProps,
} from '../shared/FilterableTable';
import { FloatingControls } from '../shared/FloatingControls';

import { ISelection } from '.';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { CreateUserDialog } from './CreateUserDialog';
import { UserSidebar } from './UserSidebar';

import './UsersTable.scss';

const FilterableUserTable: React.ComponentType<
  IFilterableTableProps<User>
> = FilterableTable;

export const UsersTable = ({
  getUsersRealms,
  isChangePasswordOpen,
  isCreateUserOpen,
  onSearchStringChange,
  onToggleChangePassword,
  onToggleCreateUser,
  onUserChangePassword,
  onUserClick,
  onUserCreated,
  onUserDeletion,
  onUserMetadataAppended,
  onUserMetadataChanged,
  onUserMetadataDeleted,
  onUserPasswordChanged,
  onUserRoleChanged,
  onUsersDeselection,
  searchString,
  selection,
  users,
}: {
  getUsersRealms: (user: User) => Realm.Results<RealmFile>;
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  onToggleChangePassword: () => void;
  onToggleCreateUser: () => void;
  onUserChangePassword: (userId: string) => void;
  onUserClick: (e: React.MouseEvent<HTMLElement>, user: User) => void;
  onUserCreated: (username: string, password: string) => void;
  onUserDeletion: (userId: string) => void;
  onUserMetadataAppended: (userId: string) => void;
  onUserMetadataChanged: (
    userId: string,
    index: number,
    key: string,
    value: string,
  ) => void;
  onUserMetadataDeleted: (userId: string, index: number) => void;
  onUserPasswordChanged: (userId: string, password: string) => void;
  onUserRoleChanged: (userId: string, role: UserRole) => void;
  onUsersDeselection: () => void;
  selection: ISelection | null;
  users: Realm.Results<User>;
  searchString: string;
  onSearchStringChange: (query: string) => void;
}) => {
  return (
    <div className="UsersTable">
      <FilterableUserTable
        className="UsersTable__Table"
        elements={users}
        isElementsEqual={(a, b) => a.userId === b.userId}
        onElementClick={onUserClick}
        onElementsDeselection={onUsersDeselection}
        onSearchStringChange={onSearchStringChange}
        searchPlaceholder="Search users"
        searchString={searchString}
        selectedElements={selection ? [selection.user] : []}
      >
        <Column
          label="Provider Id(s)"
          dataKey="accounts"
          width={200}
          cellRenderer={({ cellData }) => {
            const accounts = cellData as IAccount[];
            return (
              <span>
                {accounts.map((account, index) => (
                  <span key={index} title={`Provider: ${account.provider}`}>
                    {account.providerId}
                  </span>
                ))}
              </span>
            );
          }}
        />
        <Column label="User Id" dataKey="userId" width={200} />
        <Column
          label="Role"
          dataKey="isAdmin"
          width={100}
          cellRenderer={({ cellData }) => {
            return cellData ? 'Administrator' : 'Regular user';
          }}
        />
        <Column
          label="# Realms"
          dataKey="userId"
          width={100}
          cellRenderer={({ rowData }) => {
            const user = rowData as User;
            return getUsersRealms(user).length;
          }}
        />
      </FilterableUserTable>

      <FloatingControls isOpen={selection === null}>
        <Button onClick={onToggleCreateUser}>Create new user</Button>
      </FloatingControls>

      <UserSidebar
        isOpen={!!selection}
        onClose={onUsersDeselection}
        onUserChangePassword={onUserChangePassword}
        onUserDeletion={onUserDeletion}
        onUserMetadataAppended={onUserMetadataAppended}
        onUserMetadataChanged={onUserMetadataChanged}
        onUserMetadataDeleted={onUserMetadataDeleted}
        onUserRoleChanged={onUserRoleChanged}
        selection={selection}
      />

      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onToggle={onToggleChangePassword}
        onPasswordChanged={onUserPasswordChanged}
        user={selection ? selection.user : undefined}
      />

      <CreateUserDialog
        isOpen={isCreateUserOpen}
        onToggle={onToggleCreateUser}
        onUserCreated={onUserCreated}
      />
    </div>
  );
};
