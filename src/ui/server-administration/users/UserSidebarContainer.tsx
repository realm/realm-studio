import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { getAuthRealm, IAuthUser, IAuthUserMetadata } from "../../../services/ros";

import { UserRole, UserSidebar } from "./UserSidebar";
export { UserRole };

export interface IUserSidebarContainerProps {
  className: string | null;
  metadatas: IAuthUserMetadata[];
  onUserDeleted: (userId: string) => void;
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

  public onDeleted = () => {
    if (this.props.user) {
      this.props.onUserDeleted(this.props.user.userId);
    }
  }
}
