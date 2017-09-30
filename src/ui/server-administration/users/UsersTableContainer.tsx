import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import {
  createUser,
  IRealmFile,
  IUser,
  IUserMetadataRow,
  updateUserPassword,
} from '../../../services/ros';
import { showError } from '../../reusable/errors';
import { AdminRealmLoadingComponent } from '../AdminRealmLoadingComponent';

import { UserRole, UsersTable } from './UsersTable';

export interface IUsersTableContainerProps {
  user: Realm.Sync.User;
}

export interface IUsersTableContainerState {
  hasLoaded: boolean;
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  selectedUserId: string | null;
  users: Realm.Results<IUser> | null;
}

export class UsersTableContainer extends AdminRealmLoadingComponent<
  IUsersTableContainerProps,
  IUsersTableContainerState
> {
  constructor() {
    super();
    this.state = {
      hasLoaded: false,
      isChangePasswordOpen: false,
      isCreateUserOpen: false,
      selectedUserId: null,
      users: null,
    };
  }

  public componentDidUpdate(
    prevProps: IUsersTableContainerProps,
    prevState: IUsersTableContainerState,
  ) {
    // Fetch the users realm from ROS
    if (prevProps.user !== this.props.user) {
      this.cancelLoadingRealms();
      this.initializeRealm();
    }
  }

  public render() {
    return (
      <UsersTable
        userCount={this.state.users ? this.state.users.length : 0}
        {...this.state}
        {...this}
      />
    );
  }

  public onUserSelected = (userId: string | null) => {
    this.setState({
      selectedUserId: userId,
    });
  };

  public getUser = (index: number): IUser | null => {
    return this.state.users ? this.state.users[index] : null;
  };

  public getUserFromId = (userId: string): IUser | null => {
    return this.adminRealm.objectForPrimaryKey<IUser>('User', userId);
  };

  public getUsersRealms = (userId: string): IRealmFile[] => {
    const user = this.adminRealm.objectForPrimaryKey<IRealmFile>(
      'User',
      userId,
    );
    if (user) {
      const realms = this.adminRealm
        .objects<IRealmFile>('RealmFile')
        .filtered('owner = $0', user);
      return realms.slice();
    } else {
      return [];
    }
  };

  public getUsersMetadatas = (userId: string): IUserMetadataRow[] => {
    const user = this.getUserFromId(userId);
    return user ? user.metadata.slice() : [];
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
    const userId = await createUser(this.props.user.server, username, password);
    this.onUserSelected(userId);
  };

  public onUserDeletion = async (userId: string) => {
    const confirmed = await this.confirmUserDeletion(userId);
    if (confirmed) {
      this.adminRealm.write(() => {
        const user = this.adminRealm.objectForPrimaryKey<IUser>('User', userId);
        this.adminRealm.delete(user);
      });
      if (userId === this.state.selectedUserId) {
        this.onUserSelected(null);
      }
    }
  };

  public onUserMetadataAppended = (userId: string) => {
    const user = this.getUserFromId(userId);
    if (user) {
      this.adminRealm.write(() => {
        const metadataRow = this.adminRealm.create<
          IUserMetadataRow
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
      this.adminRealm.write(() => {
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
      this.adminRealm.write(() => {
        this.adminRealm.delete(user.metadata[index]);
      });
    } else {
      throw new Error(
        `Cannot update users metadata, index ${index} is out of bounds.`,
      );
    }
  };

  public onUserPasswordChanged = (userId: string, password: string) => {
    const success = updateUserPassword(this.props.user, userId, password);
    if (!success) {
      showError("Couldn't update password");
    }
  };

  public onUserRoleChanged = (userId: string, role: UserRole) => {
    const user = this.adminRealm.objectForPrimaryKey<IUser>('User', userId);
    if (user) {
      this.adminRealm.write(() => {
        user.isAdmin = role === UserRole.Administrator;
      });
    } else {
      throw new Error(`Found no user with the id ${userId}`);
    }
  };

  protected onAdminRealmChanged = () => {
    this.forceUpdate();
  };

  protected onAdminRealmLoaded = () => {
    // Get the users and save them in the state
    this.setState({
      users: this.adminRealm.objects<IUser>('User').sorted('userId'),
    });
  };

  private confirmUserDeletion(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      electron.remote.dialog.showMessageBox(
        electron.remote.getCurrentWindow(),
        {
          type: 'warning',
          message: `Are you sure you want to delete this user?`,
          title: `Deleting ${userId}`,
          buttons: ['Cancel', 'Delete'],
        },
        response => {
          resolve(response === 1);
        },
      );
    });
  }
}
