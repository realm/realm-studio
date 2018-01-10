import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import * as ros from '../../../../services/ros';

import { UserSidebar } from './UserSidebar';

export interface IUserSidebarContainerProps {
  isOpen: boolean;
  onToggle: () => void;
  onUserChangePassword: (userId: string) => void;
  onUserDeletion: (userId: string) => void;
  onUserMetadataAppended: (userId: string) => void;
  onUserMetadataChanged: (
    userId: string,
    index: number,
    key: string,
    value: string,
  ) => void;
  onUserMetadataDeleted: (userId: string, index: number) => void;
  onUserRoleChanged: (userId: string, role: ros.UserRole) => void;
  realms: ros.IRealmFile[];
  user: ros.IUser | null;
}

export interface IUserSidebarContainerState {
  roleDropdownOpen: boolean;
}

export class UserSidebarContainer extends React.Component<
  IUserSidebarContainerProps,
  IUserSidebarContainerState
> {
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
  };

  public onRoleChanged = (role: ros.UserRole) => {
    if (this.props.user) {
      this.props.onUserRoleChanged(this.props.user.userId, role);
    }
  };

  public onDeletion = () => {
    if (this.props.user) {
      this.props.onUserDeletion(this.props.user.userId);
    }
  };

  public onChangePassword = () => {
    if (this.props.user) {
      this.props.onUserChangePassword(this.props.user.userId);
    }
  };

  public onMetadataAppended = () => {
    if (this.props.user) {
      this.props.onUserMetadataAppended(this.props.user.userId);
    }
  };

  public onMetadataChanged = (index: number, key: string, value: string) => {
    if (this.props.user) {
      this.props.onUserMetadataChanged(
        this.props.user.userId,
        index,
        key,
        value,
      );
    }
  };

  public onMetadataDeleted = (index: number) => {
    if (this.props.user) {
      this.props.onUserMetadataDeleted(this.props.user.userId, index);
    }
  };
}
