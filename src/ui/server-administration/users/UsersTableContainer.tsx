import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import {
  createUser,
  IRealmFile,
  IUser,
  IUserMetadataRow,
  RealmLoadingMode,
  updateUserPassword,
} from '../../../services/ros';
import { showError } from '../../reusable/errors';
import { ILoadingProgress } from '../../reusable/loading-overlay';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../../reusable/realm-loading-component';

import { UserRole, UsersTable } from './UsersTable';

export interface IUsersTableContainerProps {
  user: Realm.Sync.User;
}

export interface IUsersTableContainerState extends IRealmLoadingComponentState {
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  selectedUserId: string | null;
  users: Realm.Results<IUser> | null;
  progress: ILoadingProgress;
}

export class UsersTableContainer extends RealmLoadingComponent<
  IUsersTableContainerProps,
  IUsersTableContainerState
> {
  constructor() {
    super();
    this.state = {
      isChangePasswordOpen: false,
      isCreateUserOpen: false,
      selectedUserId: null,
      users: null,
      progress: {
        done: false,
      },
    };
  }

  public componentDidMount() {
    if (this.props.user) {
      this.gotUser(this.props.user);
    }
  }

  public componentDidUpdate(
    prevProps: IUsersTableContainerProps,
    prevState: IUsersTableContainerState,
  ) {
    // Fetch the realms realm from ROS
    if (prevProps.user !== this.props.user) {
      this.gotUser(this.props.user);
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
    return this.realm.objectForPrimaryKey<IUser>('User', userId);
  };

  public getUsersRealms = (userId: string): IRealmFile[] => {
    const user = this.realm.objectForPrimaryKey<IRealmFile>('User', userId);
    if (user) {
      const realms = this.realm
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
      this.realm.write(() => {
        const user = this.realm.objectForPrimaryKey<IUser>('User', userId);
        this.realm.delete(user);
      });
      if (userId === this.state.selectedUserId) {
        this.onUserSelected(null);
      }
    }
  };

  public onUserMetadataAppended = (userId: string) => {
    const user = this.getUserFromId(userId);
    if (user) {
      this.realm.write(() => {
        const metadataRow = this.realm.create<
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
      this.realm.write(() => {
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
      this.realm.write(() => {
        this.realm.delete(user.metadata[index]);
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
    const user = this.realm.objectForPrimaryKey<IUser>('User', userId);
    if (user) {
      this.realm.write(() => {
        user.isAdmin = role === UserRole.Administrator;
      });
    } else {
      throw new Error(`Found no user with the id ${userId}`);
    }
  };

  protected gotUser(user: Realm.Sync.User) {
    this.loadRealm({
      authentication: this.props.user,
      mode: RealmLoadingMode.Synced,
      path: '__admin',
      validateCertificates: true,
    });
  }

  protected onRealmChanged = () => {
    this.forceUpdate();
  };

  protected onRealmLoaded = () => {
    // Get the users and save them in the state
    this.setState({
      users: this.realm.objects<IUser>('User').sorted('userId'),
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
