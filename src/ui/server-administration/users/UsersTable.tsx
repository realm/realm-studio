import * as classnames from 'classnames';
import * as React from 'react';
import {
  AutoSizer,
  Column,
  Dimensions as IAutoSizerDimensions,
  Table,
} from 'react-virtualized';
import { Button } from 'reactstrap';

import * as ros from '../../../services/ros';

import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/loading-overlay';
import { FloatingControls } from '../shared/FloatingControls';
import { ChangePasswordDialogContainer } from './ChangePasswordDialogContainer';
import { CreateUserDialogContainer } from './CreateUserDialogContainer';
import { UserSidebar } from './UserSidebar';
import './UsersTable.scss';

export const UsersTable = ({
  getUser,
  getUserFromId,
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
  progress,
  selectedUserId,
  toggleChangePassword,
  toggleCreateUser,
  userCount,
}: {
  getUser: (index: number) => ros.IUser | null;
  getUserFromId: (userId: string) => ros.IUser | null;
  getUsersRealms: (userId: string) => ros.IRealmFile[];
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
  progress: ILoadingProgress;
  selectedUserId: string | null;
  toggleChangePassword: () => void;
  toggleCreateUser: () => void;
  userCount: number;
}) => {
  return (
    <div className="UsersTable">
      <div
        className="UsersTable__table"
        onClick={event => {
          onUserSelected(null);
        }}
      >
        <AutoSizer>
          {({ width, height }: IAutoSizerDimensions) => (
            <Table
              width={width}
              height={height}
              rowHeight={30}
              headerHeight={30}
              rowClassName={({ index }) => {
                const user = getUser(index);
                return classnames('UsersTable__row', {
                  'UsersTable__selected-row':
                    user && user.userId === selectedUserId,
                });
              }}
              rowCount={userCount}
              rowGetter={({ index }) => getUser(index)}
              onRowClick={({ event, index }) => {
                const user = getUser(index);
                onUserSelected(
                  user && user.userId !== selectedUserId ? user.userId : null,
                );
                event.stopPropagation();
              }}
            >
              <Column
                label="Provider Id(s)"
                dataKey="accounts"
                width={200}
                cellRenderer={({ cellData }) => {
                  const accounts = cellData as ros.IAccount[];
                  return (
                    <span>
                      {accounts.map(account => (
                        <span title={`Provider: ${account.provider}`}>
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
                cellRenderer={({ cellData }) => {
                  const userId = cellData as string;
                  return getUsersRealms(userId).length;
                }}
              />
            </Table>
          )}
        </AutoSizer>
      </div>

      <FloatingControls isOpen={selectedUserId === null}>
        <Button onClick={toggleCreateUser}>Create new user</Button>
      </FloatingControls>

      <UserSidebar
        isOpen={selectedUserId !== null}
        onUserChangePassword={onUserChangePassword}
        onUserDeletion={onUserDeletion}
        onUserMetadataAppended={onUserMetadataAppended}
        onUserMetadataChanged={onUserMetadataChanged}
        onUserMetadataDeleted={onUserMetadataDeleted}
        onUserRoleChanged={onUserRoleChanged}
        realms={selectedUserId !== null ? getUsersRealms(selectedUserId) : []}
        user={selectedUserId !== null ? getUserFromId(selectedUserId) : null}
      />

      <ChangePasswordDialogContainer
        isOpen={isChangePasswordOpen}
        toggle={toggleChangePassword}
        onPasswordChanged={onUserPasswordChanged}
        user={selectedUserId !== null ? getUserFromId(selectedUserId) : null}
      />

      <CreateUserDialogContainer
        isOpen={isCreateUserOpen}
        toggle={toggleCreateUser}
        onUserCreated={onUserCreated}
      />

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
