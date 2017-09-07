import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import {
  createUser,
  getAuthRealm,
  getRealmManagementRealm,
  IAuthUser,
  IAuthUserMetadata,
  IRealmFile,
  updateUserPassword,
} from "../../../services/ros";

import { UserRole, UsersTable } from "./UsersTable";

export interface IUsersTableContainerProps {
  user: Realm.Sync.User;
}

export interface IUsersTableContainerState {
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  users: Realm.Results<IAuthUser> | null;
  selectedUserId: string | null;
}

export class UsersTableContainer extends React.Component<IUsersTableContainerProps, IUsersTableContainerState> {

  private authRealm: Realm;
  private realmManagementRealm: Realm;

  constructor() {
    super();
    this.state = {
      isChangePasswordOpen: false,
      isCreateUserOpen: false,
      users: null,
      selectedUserId: null,
    };
  }

  public componentDidMount() {
    this.initializeRealms();
    this.updateUsers();
  }

  public componentWillUnmount() {
    this.authRealm.removeListener("change", this.onUsersChanged);
  }

  public componentDidUpdate(prevProps: IUsersTableContainerProps, prevState: IUsersTableContainerState) {
    // Fetch the users realm from ROS
    if (prevProps.user !== this.props.user) {
      this.initializeRealms();
      this.updateUsers();
    }
  }

  public render() {
    return <UsersTable
      isChangePasswordOpen={this.state.isChangePasswordOpen}
      isCreateUserOpen={this.state.isCreateUserOpen}
      selectedUserId={this.state.selectedUserId}
      userCount={this.state.users ? this.state.users.length : 0}
      {...this} />;
  }

  public onUserSelected = (userId: string | null) => {
    this.setState({
      selectedUserId: userId,
    });
  }

  public getUser = (index: number): IAuthUser | null => {
    return this.state.users ? this.state.users[index] : null;
  }

  public getUserFromId = (userId: string): IAuthUser | null => {
    return this.authRealm.objectForPrimaryKey<IAuthUser>("AuthUser", userId);
  }

  public getUsersRealms = (userId: string): IRealmFile[] => {
    const realms = this.realmManagementRealm.objects<IRealmFile>("RealmFile").filtered("creatorId = $0", userId);
    return realms.slice();
  }

  public getUsersMetadatas = (userId: string): IAuthUserMetadata[] => {
    const metadata = this.authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
    return metadata.slice();
  }

  public toggleChangePassword = () => {
    this.setState({
      isChangePasswordOpen: !this.state.isChangePasswordOpen,
    });
  }

  public toggleCreateUser = () => {
    this.setState({
      isCreateUserOpen: !this.state.isCreateUserOpen,
    });
  }

  public onUserChangePassword = (userId: string) => {
    this.setState({
      isChangePasswordOpen: true,
      selectedUserId: userId,
    });
  }

  public onUserCreated = async (username: string, password: string) => {
    const userId = await createUser(this.props.user.server, username, password);
    this.onUserSelected(userId);
  }

  public onUserDeletion = async (userId: string) => {
    const confirmed = await this.confirmUserDeletion(userId);
    if (confirmed) {
      this.authRealm.write(() => {
        const user = this.authRealm.objectForPrimaryKey<IAuthUser>("AuthUser", userId);
        this.authRealm.delete(user);
      });
      if (userId === this.state.selectedUserId) {
        this.onUserSelected(null);
      }
    }
  }

  public onUserMetadataAppended = (userId: string) => {
    const metadatas = this.authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
    this.authRealm.write(() => {
      this.authRealm.create<IAuthUserMetadata>("AuthUserMetadata", {
        key: "",
        userId,
        value: "",
      });
    });
  }

  public onUserMetadataChanged = (userId: string, index: number, key: string, value: string) => {
    const metadatas = this.authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
    if (index >= 0 && index < metadatas.length) {
      this.authRealm.write(() => {
        metadatas[index].key = key;
        metadatas[index].value = value;
      });
    } else {
      throw new Error(`Cannot update users metadata, index ${index} is out of bounds.`);
    }
  }

  public onUserMetadataDeleted = (userId: string, index: number) => {
    const metadatas = this.authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
    if (index >= 0 && index < metadatas.length) {
      this.authRealm.write(() => {
        this.authRealm.delete(metadatas[index]);
      });
    } else {
      throw new Error(`Cannot update users metadata, index ${index} is out of bounds.`);
    }
  }

  public onUserPasswordChanged = (userId: string, password: string) => {
    updateUserPassword(userId, password);
  }

  public onUserRoleChanged = (userId: string, role: UserRole) => {
    const user = this.authRealm.objectForPrimaryKey<IAuthUser>("AuthUser", userId);
    if (user) {
      this.authRealm.write(() => {
        user.isAdmin = role === UserRole.Administrator;
      });
    } else {
      throw new Error(`Found no user with the id ${userId}`);
    }
  }

  private initializeRealms() {
    // Remove any existing a change listeners
    if (this.authRealm) {
      this.authRealm.removeListener("change", this.onUsersChanged);
    }
    if (this.realmManagementRealm) {
      this.realmManagementRealm.removeListener("change", this.onRealmsChanged);
    }

    // Get the realms from the ROS interface
    this.authRealm = getAuthRealm(this.props.user);
    this.realmManagementRealm = getRealmManagementRealm(this.props.user);

    // Register change listeners
    this.authRealm.addListener("change", this.onUsersChanged);
    this.realmManagementRealm.addListener("change", this.onRealmsChanged);
  }

  private updateUsers() {
    // Get the users
    const users = this.authRealm.objects<IAuthUser>("AuthUser").sorted("userId");
    // Set the state
    this.setState({
      users,
    });
  }

  private onUsersChanged = () => {
    this.forceUpdate();
  }

  private onRealmsChanged = () => {
    this.forceUpdate();
  }

  private confirmUserDeletion(userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      electron.remote.dialog.showMessageBox(electron.remote.getCurrentWindow(), {
        type: "warning",
        message: `Are you sure you want to delete this user?`,
        title: `Deleting ${userId}`,
        buttons: ["Cancel", "Delete"],
      }, (response) => {
        resolve(response === 1);
      });
    });
  }
}
