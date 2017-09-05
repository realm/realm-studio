import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { getAuthRealm, IAuthUser, IAuthUserMetadata, IRealmFile } from "../../../services/ros";

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
}

export class UserSidebarContainer
extends React.Component<IUserSidebarContainerProps, IUserSidebarContainerState> {

  private authRealm: Realm;

  constructor() {
    super();
    this.state = {
      roleDropdownOpen: false,
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
}
