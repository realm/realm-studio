import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import {
  appendUserMetadata,
  deleteUserMetadata,
  getAuthRealm,
  IAuthUser,
  IAuthUserMetadata,
  IRealmFile,
  updateUserMetadata,
} from "../../../services/ros";

import { UserRole, UserSidebar } from "./UserSidebar";
export { UserRole };

export interface IUserSidebarContainerProps {
  className: string | null;
  metadatas: IAuthUserMetadata[];
  realms: IRealmFile[];
  onUserChangePassword: (userId: string) => void;
  onUserDeletion: (userId: string) => void;
  onUserRoleChanged: (userId: string, role: UserRole) => void;
  user: IAuthUser | null;
}

export interface IUserSidebarContainerState {
  roleDropdownOpen: boolean;
  editingMetadataIndex: number | null;
}

export class UserSidebarContainer
extends React.Component<IUserSidebarContainerProps, IUserSidebarContainerState> {

  private authRealm: Realm;

  constructor() {
    super();
    this.state = {
      roleDropdownOpen: false,
      editingMetadataIndex: null,
    };
  }

  public render() {
    return <UserSidebar {...this.props} {...this.state} {...this} />;
  }

  public toggleRoleDropdown = () => {
    this.setState({
      roleDropdownOpen: !this.state.roleDropdownOpen,
    });
  }

  public onRoleChanged = (role: UserRole) => {
    if (this.props.user) {
      this.props.onUserRoleChanged(this.props.user.userId, role);
    }
  }

  public onDeletion = () => {
    if (this.props.user) {
      this.props.onUserDeletion(this.props.user.userId);
    }
  }

  public onChangePassword = () => {
    if (this.props.user) {
      this.props.onUserChangePassword(this.props.user.userId);
    }
  }

  public onMetadataAppended = () => {
    if (this.props.user) {
      appendUserMetadata(this.props.user.userId, "", "");
    }
  }

  public onMetadataChanged = (index: number, key: string, value: string) => {
    if (this.props.user) {
      updateUserMetadata(this.props.user.userId, index, key, value);
    }
  }

  public onMetadataDeleted = (index: number) => {
    if (this.props.user) {
      deleteUserMetadata(this.props.user.userId, index);
    }
  }
}
