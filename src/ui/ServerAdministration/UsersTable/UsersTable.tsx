import * as React from 'react';
import { Column } from 'react-virtualized';
import { Button } from 'reactstrap';

import * as ros from '../../../services/ros';

import {
  FilterableTable,
  FilterableTableWrapper,
} from '../shared/FilterableTable';
import { FloatingControls } from '../shared/FloatingControls';

import { ISelection } from '.';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { CreateUserDialog } from './CreateUserDialog';
import { UserSidebar } from './UserSidebar';

export const UsersTable = ({
  getUsersRealms,
  isChangePasswordOpen,
  isCreateUserOpen,
  onUserChangePassword,
  onUserCreated,
  onUserDeletion,
  onUserMetadataAppended,
  onUserMetadataChanged,
  onUserMetadataDeleted,
  onUserPasswordChanged,
  onUserRoleChanged,
  onUserSelected,
  selection,
  toggleChangePassword,
  toggleCreateUser,
  users,
  searchString,
  onSearchStringChange,
}: {
  getUsersRealms: (user: ros.IUser) => Realm.Results<ros.IRealmFile>;
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  onUserChangePassword: (userId: string) => void;
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
  onUserRoleChanged: (userId: string, role: ros.UserRole) => void;
  onUserSelected: (userId: string | null) => void;
  selection: ISelection | null;
  toggleChangePassword: () => void;
  toggleCreateUser: () => void;
  users: Realm.Results<ros.IUser>;
  searchString: string;
  onSearchStringChange: (query: string) => void;
}) => {
  return (
    <FilterableTableWrapper>
      <FilterableTable
        searchString={searchString}
        onSearchStringChange={onSearchStringChange}
        searchPlaceholder="Search users"
        onElementSelected={onUserSelected}
        onElementDoubleClick={onUserSelected}
        elements={users}
        elementIdProperty="userId"
        selectedIdPropertyValue={selection ? selection.user.userId : null}
      >
        <Column
          label="Provider Id(s)"
          dataKey="accounts"
          width={200}
          cellRenderer={({ cellData }) => {
            const accounts = cellData as ros.IAccount[];
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
            const user = rowData as ros.IUser;
            return getUsersRealms(user).length;
          }}
        />
      </FilterableTable>

      <FloatingControls isOpen={selection === null}>
        <Button onClick={toggleCreateUser}>Create new user</Button>
      </FloatingControls>

      <UserSidebar
        isOpen={selection !== null}
        onToggle={() => onUserSelected(null)}
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
        toggle={toggleChangePassword}
        onPasswordChanged={onUserPasswordChanged}
        user={selection ? selection.user : undefined}
      />

      <CreateUserDialog
        isOpen={isCreateUserOpen}
        toggle={toggleCreateUser}
        onUserCreated={onUserCreated}
      />
    </FilterableTableWrapper>
  );
};
