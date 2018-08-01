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
import { querySomeFieldContainsText } from '../utils';
import { UsersTable } from './UsersTable';

export interface ISelection {
  user: ros.IUser;
  realms: Realm.Results<ros.IRealmFile>;
}

export interface IUsersTableContainerProps {
  adminRealm: Realm;
  adminRealmChanges: number;
  user: Realm.Sync.User;
  validateCertificates: boolean;
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
      let users = adminRealm.objects<ros.IUser>('User').sorted('userId');
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
          "NOT userId == '__admin' AND NOT userId BEGINSWITH 'system-accessibility'",
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
  }

  public render() {
    const users = this.users(
      this.props.adminRealm,
      this.state.searchString,
      this.state.showSystemUsers,
    );
    return (
      <UsersTable
        getUsersRealms={this.getUsersRealms}
        isChangePasswordOpen={this.state.isChangePasswordOpen}
        isCreateUserOpen={this.state.isCreateUserOpen}
        onSearchStringChange={this.onSearchStringChange}
        onToggleChangePassword={this.onToggleChangePassword}
        onToggleCreateUser={this.onToggleCreateUser}
        onUserChangePassword={this.onUserChangePassword}
        onUserCreated={this.onUserCreated}
        onUserDeletion={this.onUserDeletion}
        onUserMetadataAppended={this.onUserMetadataAppended}
        onUserMetadataChanged={this.onUserMetadataChanged}
        onUserMetadataDeleted={this.onUserMetadataDeleted}
        onUserPasswordChanged={this.onUserPasswordChanged}
        onUserRoleChanged={this.onUserRoleChanged}
        onUserSelected={this.onUserSelected}
        searchString={this.state.searchString}
        selection={this.state.selection}
        users={users}
      />
    );
  }

  public onUserSelected = (userId: string | null) => {
    const { adminRealm } = this.props;
    if (userId) {
      const user = adminRealm.objectForPrimaryKey<ros.IUser>('User', userId);
      if (!user) {
        throw new Error(`Couldn't select user with ID ${userId}`);
      }
      const realms = this.getUsersRealms(user);
      this.setState({ selection: { user, realms } });
    } else {
      this.setState({ selection: null });
    }
  };

  public getUsersRealms = (user: ros.IUser): Realm.Results<ros.IRealmFile> => {
    return this.props.adminRealm
      .objects<ros.IRealmFile>('RealmFile')
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
    this.onUserSelected(userId);
  };

  public onUserCreated = async (username: string, password: string) => {
    const userId = await ros.users.create(
      this.props.user.server,
      username,
      password,
    );
    this.onUserSelected(userId);
  };

  public onUserDeletion = async (userId: string) => {
    const confirmed = await this.confirmUserDeletion(userId);
    if (confirmed) {
      // Deselect the user before deleting it
      if (this.state.selection && this.state.selection.user.userId === userId) {
        this.onUserSelected(null);
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

  public onSearchStringChange = (searchString: string) => {
    this.setState({ searchString });
  };

  protected onRealmChanged = () => {
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
}

export { UsersTableContainer as UsersTable };
