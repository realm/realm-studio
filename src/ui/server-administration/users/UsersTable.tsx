import * as classnames from "classnames";
import * as React from "react";
import { AutoSizer, Column, Dimensions as IAutoSizerDimensions, Table } from "react-virtualized";
import { Button } from "reactstrap";

import { IAuthUser, IAuthUserMetadata, IRealmFile } from "../../../services/ros";

import { ChangePasswordDialogContainer } from "./ChangePasswordDialogContainer";
import { CreateUserDialogContainer } from "./CreateUserDialogContainer";
import { UserRole, UserSidebarContainer } from "./UserSidebarContainer";
export { UserRole };

import "./UsersTable.scss";

export const UsersTable = ({
  getUser,
  getUserFromId,
  getUsersRealms,
  isChangePasswordOpen,
  isCreateUserOpen,
  onUserChangePassword,
  onUserCreated,
  onUserDeletion,
  onUserPasswordChanged,
  onUserRoleChanged,
  onUserSelected,
  selectedUserId,
  selectedUsersMetadatas,
  toggleChangePassword,
  toggleCreateUser,
  userCount,
}: {
  getUser: (index: number) => IAuthUser | null,
  getUserFromId: (userId: string) => IAuthUser | null,
  getUsersRealms: (userId: string) => IRealmFile[],
  isChangePasswordOpen: boolean,
  isCreateUserOpen: boolean,
  onUserChangePassword: (userId: string) => void,
  onUserCreated: (username: string, password: string) => void,
  onUserDeletion: (userId: string) => void,
  onUserPasswordChanged: (userId: string, password: string) => void,
  onUserRoleChanged: (userId: string, role: UserRole) => void,
  onUserSelected: (userId: string | null) => void,
  selectedUserId: string | null,
  selectedUsersMetadatas: IAuthUserMetadata[],
  toggleChangePassword: () => void,
  toggleCreateUser: () => void,
  userCount: number,
}) => {
  return (
    <div className="UsersTable">
      <div className="UsersTable__table">
        <AutoSizer>
        {({width, height}: IAutoSizerDimensions) => (
          <Table width={width} height={height}
            rowHeight={30} headerHeight={30}
            rowClassName={({ index }) => {
              const user = getUser(index);
              return classnames("UsersTable__row", {
                "UsersTable__selected-row": user && user.userId === selectedUserId,
              });
            }}
            rowCount={userCount}
            rowGetter={({ index }) => getUser(index)}
            onRowClick={({event, index}) => {
              const user = getUser(index);
              onUserSelected(user && user.userId !== selectedUserId ? user.userId : null);
              event.preventDefault();
            }}>
            <Column label="ID" dataKey="userId" width={300} />
            <Column label="Role" dataKey="isAdmin" width={150} cellRenderer={({ cellData }) => {
              return cellData ? "Administrator" : "Regular user";
            }} />
            <Column label="Realms" dataKey="userId" width={150} cellRenderer={({ cellData }) => {
              const userId = cellData as string;
              return getUsersRealms(userId).length;
            }} />
          </Table>
        )}
        </AutoSizer>
      </div>

      <div className={classnames("UsersTable__overlayed-controls", {
        "UsersTable__overlayed-controls--hidden": selectedUserId !== null,
      })}>
        <Button onClick={toggleCreateUser}>
          Create new user
        </Button>
      </div>

      <UserSidebarContainer className={classnames("UsersTable__selected-user", {
        "UsersTable__selected-user--active": selectedUserId !== null,
      })}
        metadatas={selectedUsersMetadatas}
        onUserChangePassword={onUserChangePassword}
        onUserDeletion={onUserDeletion}
        onUserRoleChanged={onUserRoleChanged}
        realms={selectedUserId !== null ? getUsersRealms(selectedUserId) : []}
        user={selectedUserId !== null ? getUserFromId(selectedUserId) : null} />

      <ChangePasswordDialogContainer
        isOpen={isChangePasswordOpen}
        toggle={toggleChangePassword}
        onPasswordChanged={onUserPasswordChanged}
        user={selectedUserId !== null ? getUserFromId(selectedUserId) : null} />

      <CreateUserDialogContainer
        isOpen={isCreateUserOpen}
        toggle={toggleCreateUser}
        onUserCreated={onUserCreated} />
    </div>
  );
};
