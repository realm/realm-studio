import * as classnames from "classnames";
import * as React from "react";
import { AutoSizer, Column, Dimensions as IAutoSizerDimensions, Table } from "react-virtualized";

import { IAuthUser, IAuthUserMetadata, IRealmFile } from "../../../services/ros";

import { UserRole, UserSidebarContainer } from "./UserSidebarContainer";
export { UserRole };

import "./UsersTable.scss";

export const UsersTable = ({
  userCount,
  getUser,
  getUserFromId,
  getUsersRealms,
  onUserDeleted,
  onUserSelected,
  onUserRoleChanged,
  selectedUserId,
  selectedUsersMetadatas,
}: {
  userCount: number,
  getUser: (index: number) => IAuthUser | null,
  getUserFromId: (userId: string) => IAuthUser | null,
  getUsersRealms: (userId: string) => IRealmFile[],
  onUserDeleted: (userId: string) => void,
  onUserSelected: (userId: string | null) => void,
  onUserRoleChanged: (userId: string, role: UserRole) => void,
  selectedUserId: string | null,
  selectedUsersMetadatas: IAuthUserMetadata[],
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
            <Column label="Realms" dataKey={null} width={150} cellRenderer={({ rowData }) => {
              const user = rowData as IAuthUser;
              return getUsersRealms(user.userId).length;
            }} />
          </Table>
        )}
        </AutoSizer>
      </div>
      <UserSidebarContainer className={classnames("UsersTable__selected-user", {
        "UsersTable__selected-user--active": selectedUserId !== null,
      })}
        realms={selectedUserId !== null ? getUsersRealms(selectedUserId) : []}
        user={selectedUserId !== null ? getUserFromId(selectedUserId) : null}
        onUserDeleted={onUserDeleted}
        onUserRoleChanged={onUserRoleChanged}
        metadatas={selectedUsersMetadatas} />
    </div>
  );
};
