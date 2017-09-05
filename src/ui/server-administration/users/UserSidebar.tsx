import * as classnames from "classnames";
import * as React from "react";
import {
  Button,
  ButtonDropdown,
  Card,
  CardBlock,
  CardSubtitle,
  CardText,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Table,
} from "reactstrap";

import { IAuthUser, IAuthUserMetadata } from "../../../services/ros";

import { IUserSidebarContainerProps } from "./UserSidebarContainer";

import "./UserSidebar.scss";

export enum UserRole {
  Administrator = "administrator",
  Regular = "regular",
}

const MetadataTable = ({
  metadatas,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
}: {
  metadatas: IAuthUserMetadata[],
  onMetadataAppended: () => void,
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
}) => {
  return (
    <Table size="sm" className="UserSidebar__MetadataTable">
      <thead>
        <tr>
          {/* We mention "Metadata" in this header, so we don't need a separate header */}
          <th>Metadata key</th>
          <th>Value</th>
          <th className="UserSidebar__MetadataTableControlCell">
            <Button size="sm" onClick={onMetadataAppended} title="Click to add a new row of metadata">
              +
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        { metadatas.map((metadata, index) => {
          return (
            <tr key={index}>
              <td title={metadata.key}>
                <Input value={metadata.key || ""} size="sm" onChange={(e) => {
                  onMetadataChanged(index, e.target.value, metadata.value || "");
                }} />
              </td>
              <td title={metadata.value}>
                <Input value={metadata.value || ""} size="sm" onChange={(e) => {
                  onMetadataChanged(index, metadata.key || "", e.target.value);
                }} />
              </td>
              <td className="UserSidebar__MetadataTableControlCell">
                <Button size="sm" className="UserSidebar__MetadataTableDeleteButton"
                  title={metadata.key ? `Click to delete "${metadata.key}"` : `Click to delete`}
                  onClick={() => {
                    onMetadataDeleted(index);
                  }}>
                  ×
                </Button>
              </td>
            </tr>
          );
        }) }
      </tbody>
    </Table>
  );
};

export interface IUserSidebarProps extends IUserSidebarContainerProps {
  editingMetadataIndex: number | null;
  onChangePassword: () => void;
  onDeletion: () => void;
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
  onRoleChanged: (role: UserRole) => void;
  roleDropdownOpen: boolean;
  toggleRoleDropdown: () => void;
}

export const UserSidebar = ({
  className,
  editingMetadataIndex,
  metadatas,
  onChangePassword,
  onDeletion,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
  onRoleChanged,
  realms,
  roleDropdownOpen,
  toggleRoleDropdown,
  user,
}: IUserSidebarProps) => {
  return (
    <div className={classnames(className, "UserSidebar")}>
      {user && (
        <Card className="UserSidebar__card">
          <CardBlock>
            <CardTitle className="UserSidebar__title">
              <span title={user.userId}>{user.userId}</span>
            </CardTitle>
            <ButtonDropdown isOpen={roleDropdownOpen} toggle={toggleRoleDropdown}>
              <DropdownToggle caret>
                {user.isAdmin ? "Administrator" : "Regular user"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => onRoleChanged(UserRole.Administrator)}>
                  Administrator
                </DropdownItem>
                <DropdownItem onClick={() => onRoleChanged(UserRole.Regular)}>
                  Regular user
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>

            <MetadataTable metadatas={metadatas}
              onMetadataAppended={onMetadataAppended}
              onMetadataChanged={onMetadataChanged}
              onMetadataDeleted={onMetadataDeleted}  />

            <Table size="sm" className="UserSidebar__RealmsTable">
              <thead>
                <tr>
                  {/* We mention "Realm" in this header, so we don't need a separate header */}
                  <th>Realm path</th>
                </tr>
              </thead>
              <tbody>
                { realms.map((realm) => {
                  return (
                    <tr key={realm.path}>
                      <td title={realm.path}>{realm.path}</td>
                    </tr>
                  );
                }) }
              </tbody>
            </Table>
          </CardBlock>
          <CardBlock className="UserSidebar__controls">
            <Button size="sm" onClick={() => onChangePassword()}>
              Change password
            </Button>
            <Button size="sm" color="danger" onClick={() => onDeletion()}>
              Delete
            </Button>
          </CardBlock>
        </Card>
      )}
    </div>
  );
};
