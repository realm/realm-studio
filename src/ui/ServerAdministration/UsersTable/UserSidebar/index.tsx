import * as React from 'react';

import * as ros from '../../../../services/ros';

import { ISelection } from '..';
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
  selection: ISelection | null;
}

export interface IUserSidebarContainerState {
  roleDropdownOpen: boolean;
  selection: ISelection | null;
}

class UserSidebarContainer extends React.Component<
  IUserSidebarContainerProps,
  IUserSidebarContainerState
> {
  constructor() {
    super();
    this.state = {
      roleDropdownOpen: false,
      selection: null,
    };
  }

  public componentDidUpdate(
    prevProps: IUserSidebarContainerProps,
    prevState: IUserSidebarContainerState,
  ) {
    // Update the state if a new user was passed in via the props.
    if (this.props.selection && prevProps.selection !== this.props.selection) {
      this.setState({ selection: this.props.selection });
    }
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
    if (this.props.selection) {
      this.props.onUserRoleChanged(this.props.selection.user.userId, role);
    }
  };

  public onDeletion = () => {
    if (this.props.selection) {
      this.props.onUserDeletion(this.props.selection.user.userId);
    }
  };

  public onChangePassword = () => {
    if (this.props.selection) {
      this.props.onUserChangePassword(this.props.selection.user.userId);
    }
  };

  public onMetadataAppended = () => {
    if (this.props.selection) {
      this.props.onUserMetadataAppended(this.props.selection.user.userId);
    }
  };

  public onMetadataChanged = (index: number, key: string, value: string) => {
    if (this.props.selection) {
      this.props.onUserMetadataChanged(
        this.props.selection.user.userId,
        index,
        key,
        value,
      );
    }
  };

  public onMetadataDeleted = (index: number) => {
    if (this.props.selection) {
      this.props.onUserMetadataDeleted(this.props.selection.user.userId, index);
    }
  };
}

export { UserSidebarContainer as UserSidebar };
