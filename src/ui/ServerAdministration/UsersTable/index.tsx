import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';
import { store } from '../../../store';

import * as ros from '../../../services/ros';
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

  protected users?: Realm.Results<ros.IUser>;

  public componentWillMount() {
    this.setUsers(this.state.searchString, this.state.showSystemUsers);
  }

  public componentWillUpdate(
    nextProps: IUsersTableContainerProps,
    nextState: IUsersTableContainerState,
  ) {
    if (
      this.state.searchString !== nextState.searchString ||
      this.state.showSystemUsers !== nextState.showSystemUsers
    ) {
      this.setUsers(nextState.searchString, nextState.showSystemUsers);
    }
  }

  public componentDidMount() {
    store.onDidChange(store.KEY_SHOW_SYSTEM_USERS, (newVal, oldVal) => {
      if (oldVal !== newVal) {
        const val = newVal === true;
        this.setState({ showSystemUsers: val });
      }
    });
  }

  public render() {
    return this.users ? (
      <UsersTable users={this.users} {...this.state} {...this} />
    ) : null;
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
      // Use the ROS API to delete a user, instead of changing the realm directly
      await ros.users.remove(this.props.user, userId);
      if (this.state.selection && this.state.selection.user.userId === userId) {
        this.onUserSelected(null);
      }
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

  protected setUsers(searchString: string, showSystemUsers: boolean) {
    this.users = this.props.adminRealm
      .objects<ros.IUser>('User')
      .sorted('userId');

    // Filter if a search string is specified
    if (searchString && searchString !== '') {
      const filterQuery = querySomeFieldContainsText(
        ['userId', 'accounts.providerId', 'metadata.key', 'metadata.value'],
        searchString,
      );
      try {
        this.users = this.users.filtered(filterQuery);
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Could not filter on "${filterQuery}"`, err);
      }
    }

    // Filter out System users if needed
    if (showSystemUsers === false) {
      this.users = this.users.filtered(
        "NOT userId == '__admin' AND NOT userId BEGINSWITH 'system-accessibility'",
      );
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

export { UsersTableContainer as UsersTable };
