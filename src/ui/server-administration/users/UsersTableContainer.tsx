import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import * as ros from '../../../services/ros';
import { showError } from '../../reusable/errors';
import { querySomeFieldContainsText } from '../utils';
import { UsersTable } from './UsersTable';

export interface IUsersTableContainerProps {
  adminRealm: Realm;
  adminRealmChanges: number;
  user: Realm.Sync.User;
  validateCertificates: boolean;
}

export interface IUsersTableContainerState {
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  selectedUserId: string | null;
  query: string;
}

export class UsersTableContainer extends React.Component<
  IUsersTableContainerProps,
  IUsersTableContainerState
> {
  protected users: Realm.Results<ros.IUser>;

  constructor() {
    super();
    this.state = {
      isChangePasswordOpen: false,
      isCreateUserOpen: false,
      selectedUserId: null,
      query: '',
    };
  }

  public componentWillMount() {
    this.setUsers();
  }

  public componentDidUpdate() {
    this.setUsers();
  }

  public render() {
    this.setUsers(this.state.query);
    return <UsersTable users={this.users} {...this.state} {...this} />;
  }

  public onUserSelected = (userId: string | null) => {
    this.setState({
      selectedUserId: userId,
    });
  };

  public getUserFromId = (userId: string): ros.IUser | null => {
    const { adminRealm } = this.props;
    return adminRealm.objectForPrimaryKey<ros.IUser>('User', userId);
  };

  public getUsersRealms = (userId: string): ros.IRealmFile[] => {
    const { adminRealm } = this.props;
    const user = adminRealm.objectForPrimaryKey<ros.IRealmFile>('User', userId);
    if (user) {
      const realms = adminRealm
        .objects<ros.IRealmFile>('RealmFile')
        .filtered('owner = $0', user);
      return realms.slice();
    } else {
      return [];
    }
  };

  public toggleChangePassword = () => {
    this.setState({
      isChangePasswordOpen: !this.state.isChangePasswordOpen,
    });
  };

  public toggleCreateUser = () => {
    this.setState({
      isCreateUserOpen: !this.state.isCreateUserOpen,
    });
  };

  public onUserChangePassword = (userId: string) => {
    this.setState({
      isChangePasswordOpen: true,
      selectedUserId: userId,
    });
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
      // Use the ROS API to delete a user, instead of changing the realm directly
      await ros.users.remove(this.props.user, userId);
      if (userId === this.state.selectedUserId) {
        this.onUserSelected(null);
      }
    }
  };

  public onUserMetadataAppended = (userId: string) => {
    const { adminRealm } = this.props;
    const user = this.getUserFromId(userId);
    if (user) {
      adminRealm.write(() => {
        const metadataRow = adminRealm.create<
          ros.IUserMetadataRow
        >('UserMetadataRow', {
          key: '',
          value: '',
        });
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
    const user = this.getUserFromId(userId);
    if (user && index >= 0 && index < user.metadata.length) {
      this.props.adminRealm.write(() => {
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
    const user = this.getUserFromId(userId);
    if (user && index >= 0 && index < user.metadata.length) {
      this.props.adminRealm.write(() => {
        this.props.adminRealm.delete(user.metadata[index]);
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

  public onQueryChange = (query: string) => {
    this.setState({ query });
  };

  protected onRealmChanged = () => {
    this.forceUpdate();
  };

  protected setUsers(query?: string) {
    if (!query || query === '') {
      this.users = this.props.adminRealm
        .objects<ros.IUser>('User')
        .sorted('userId');
    } else {
      try {
        this.users = this.props.adminRealm
          .objects<ros.IUser>('User')
          .filtered(
            querySomeFieldContainsText(
              [
                'userId',
                'accounts.providerId',
                'metadata.key',
                'metadata.value',
              ],
              query,
            ),
          )
          .sorted('userId');
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Could not filter on "${query}"`, err);
      }
    }
  }

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
