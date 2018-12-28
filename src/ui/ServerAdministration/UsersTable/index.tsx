////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as electron from 'electron';
import memoize from 'memoize-one';
import * as React from 'react';
import * as Realm from 'realm';

import * as ros from '../../../services/ros';
import { store } from '../../../store';
import { showError } from '../../reusable/errors';
import { withAdminRealm } from '../AdminRealm';
import { querySomeFieldContainsText } from '../utils';
import { UsersTable } from './UsersTable';

export interface ISelection {
  user: ros.User;
  realms: Realm.Results<ros.RealmFile>;
}

export interface IUsersTableContainerProps {
  adminRealm: Realm;
  user: Realm.Sync.User;
}

export interface IUsersTableContainerState {
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  searchString: string;
  showSystemUsers: boolean;
  selection: ISelection | null;
}

class UsersTableContainer extends React.Component<
  IUsersTableContainerProps,
  IUsersTableContainerState
> {
  public state: IUsersTableContainerState = {
    isChangePasswordOpen: false,
    isCreateUserOpen: false,
    selection: null,
    searchString: '',
    showSystemUsers: store.shouldShowSystemUsers(),
  };

  protected users = memoize(
    (adminRealm: Realm, searchString: string, showSystemUsers: boolean) => {
      let users = adminRealm.objects<ros.User>('User').sorted('userId');
      // Filter if a search string is specified
      if (searchString && searchString !== '') {
        const filterQuery = querySomeFieldContainsText(
          ['userId', 'accounts.providerId', 'metadata.key', 'metadata.value'],
          searchString,
        );
        try {
          users = users.filtered(filterQuery);
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.warn(`Could not filter on "${filterQuery}"`, err);
        }
      }

      // Filter out System users if needed
      if (showSystemUsers === false) {
        users = users.filtered(
          "NOT userId == '__admin' AND NOT accounts.provider BEGINSWITH 'jwt/central'",
        );
      }
      return users;
    },
  );

  public componentDidMount() {
    store.onDidChange(store.KEY_SHOW_SYSTEM_USERS, (newVal, oldVal) => {
      if (oldVal !== newVal) {
        const val = newVal === true;
        this.setState({ showSystemUsers: val });
      }
    });

    // Register a listener to update the component once a schema is available
    this.props.adminRealm.addListener('schema', this.onRealmChange);
    this.props.adminRealm.addListener('change', this.onRealmChange);
  }

  public componentWillUnmount() {
    // Remove the listener that was added when mounting
    this.props.adminRealm.removeListener('schema', this.onRealmChange);
    this.props.adminRealm.removeListener('change', this.onRealmChange);
  }

  public render() {
    // Don't render before the schema is available
    if (this.props.adminRealm.empty) {
      return null;
    }

    const users = this.users(
      this.props.adminRealm,
      this.state.searchString,
      this.state.showSystemUsers,
    );
    // Determine if the selection is valid before passing it to the table
    const selection =
      this.state.selection && this.state.selection.user.isValid()
        ? this.state.selection
        : null;
    return (
      <UsersTable
        getUsersRealms={this.getUsersRealms}
        isChangePasswordOpen={this.state.isChangePasswordOpen}
        isCreateUserOpen={this.state.isCreateUserOpen}
        onSearchStringChange={this.onSearchStringChange}
        onToggleChangePassword={this.onToggleChangePassword}
        onToggleCreateUser={this.onToggleCreateUser}
        onUserChangePassword={this.onUserChangePassword}
        onUserClick={this.onUserClick}
        onUserCreated={this.onUserCreated}
        onUserDeletion={this.onUserDeletion}
        onUserMetadataAppended={this.onUserMetadataAppended}
        onUserMetadataChanged={this.onUserMetadataChanged}
        onUserMetadataDeleted={this.onUserMetadataDeleted}
        onUserPasswordChanged={this.onUserPasswordChanged}
        onUserRoleChanged={this.onUserRoleChanged}
        onUserStatusChanged={this.onUserStatusChanged}
        onUsersDeselection={this.onUsersDeselection}
        searchString={this.state.searchString}
        selection={selection}
        users={users}
      />
    );
  }

  public onUserClick = (e: React.MouseEvent<HTMLElement>, user: ros.User) => {
    this.selectUser(user);
  };

  public getUsersRealms = (user: ros.IUser): Realm.Results<ros.RealmFile> => {
    return this.props.adminRealm
      .objects<ros.RealmFile>('RealmFile')
      .filtered('owner = $0', user);
  };

  public onToggleChangePassword = () => {
    this.setState({
      isChangePasswordOpen: !this.state.isChangePasswordOpen,
    });
  };

  public onToggleCreateUser = () => {
    this.setState({
      isCreateUserOpen: !this.state.isCreateUserOpen,
    });
  };

  public onUserChangePassword = (userId: string) => {
    this.setState({ isChangePasswordOpen: true });
    this.selectUserById(userId);
  };

  public onUserCreated = async (username: string, password: string) => {
    const userId = await ros.users.create(
      this.props.user.server,
      username,
      password,
    );
    this.selectUserById(userId);
  };

  public onUserDeletion = async (userId: string) => {
    const confirmed = await this.confirmUserDeletion(userId);
    if (confirmed) {
      // Deselect the user before deleting it
      if (this.state.selection && this.state.selection.user.userId === userId) {
        this.onUsersDeselection();
      }
      // Use the ROS API to delete a user, instead of changing the realm directly
      await ros.users.remove(this.props.user, userId);
    }
  };

  public onUserMetadataAppended = (userId: string) => {
    const { adminRealm } = this.props;
    const user = adminRealm.objectForPrimaryKey<ros.IUser>('User', userId);
    if (user) {
      adminRealm.write(() => {
        const metadataRow = adminRealm.create<ros.IUserMetadataRow>(
          'UserMetadataRow',
          {
            key: '',
            value: '',
          },
        );
        user.metadata.push(metadataRow);
      });
    }
  };

  public onUserMetadataChanged = (
    userId: string,
    index: number,
    key: string,
    value: string,
  ) => {
    const { adminRealm } = this.props;
    const user = adminRealm.objectForPrimaryKey<ros.IUser>('User', userId);
    if (user && index >= 0 && index < user.metadata.length) {
      adminRealm.write(() => {
        user.metadata[index].key = key;
        user.metadata[index].value = value;
      });
    } else {
      throw new Error(
        `Cannot update users metadata, user not found or index ${index} is out of bounds.`,
      );
    }
  };

  public onUserMetadataDeleted = (userId: string, index: number) => {
    const { adminRealm } = this.props;
    const user = adminRealm.objectForPrimaryKey<ros.IUser>('User', userId);
    if (user && index >= 0 && index < user.metadata.length) {
      adminRealm.write(() => {
        adminRealm.delete(user.metadata[index]);
      });
    } else {
      throw new Error(
        `Cannot update users metadata, index ${index} is out of bounds.`,
      );
    }
  };

  public onUserPasswordChanged = (userId: string, password: string) => {
    const success = ros.users.updatePassword(this.props.user, userId, password);
    if (!success) {
      showError("Couldn't update password");
    }
  };

  public onUserRoleChanged = (userId: string, role: ros.UserRole) => {
    const { adminRealm } = this.props;
    const user = adminRealm.objectForPrimaryKey<ros.IUser>('User', userId);
    if (user) {
      adminRealm.write(() => {
        user.isAdmin = role === ros.UserRole.Administrator;
      });
    } else {
      throw new Error(`Found no user with the id ${userId}`);
    }
  };

  public onUserStatusChanged = async (
    userId: string,
    status: ros.UserStatus,
  ) => {
    await ros.realms.updateUserStatus(this.props.user, userId, status);
  };

  public onUsersDeselection = () => {
    this.setState({ selection: null });
  };

  public onSearchStringChange = (searchString: string) => {
    this.setState({ searchString });
  };

  protected onRealmChange = () => {
    this.forceUpdate();
  };

  private confirmUserDeletion(userId: string): boolean {
    const isCurrentUser = userId === this.props.user.identity;
    const extraMessage = isCurrentUser
      ? '\n\nThis will delete the user on which you are currently logged in!'
      : '';

    const result = electron.remote.dialog.showMessageBox(
      electron.remote.getCurrentWindow(),
      {
        type: 'warning',
        message: 'Are you sure you want to delete the user?' + extraMessage,
        title: `Deleting ${userId}`,
        buttons: ['Cancel', isCurrentUser ? 'Delete my user' : 'Delete'],
      },
    );

    return result === 1;
  }

  private selectUser(user: ros.User) {
    const realms = this.getUsersRealms(user);
    this.setState({ selection: { user, realms } });
  }

  private selectUserById(userId: string) {
    const user = this.props.adminRealm.objectForPrimaryKey<ros.User>(
      'User',
      userId,
    );
    if (user) {
      this.selectUser(user);
    }
  }
}

const UsersTableWithRealm = withAdminRealm(UsersTableContainer, 'adminRealm');

export { UsersTableWithRealm as UsersTable };
