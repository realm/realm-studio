import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import {
  createUser,
  getAdminRealm,
  IRealmFile,
  IUser,
  IUserMetadataRow,
  updateUserPassword,
} from "../../../services/ros";
import { showError } from "../../reusable/errors";

import { UserRole, UsersTable } from "./UsersTable";

export interface IUsersTableContainerProps {
  user: Realm.Sync.User;
}

export interface IUsersTableContainerState {
  isChangePasswordOpen: boolean;
  isCreateUserOpen: boolean;
  users: Realm.Results<IUser> | null;
  selectedUserId: string | null;
}

export class UsersTableContainer extends React.Component<IUsersTableContainerProps, IUsersTableContainerState> {

  private adminRealm: Realm;

  constructor() {
    super();
    this.state = {
      isChangePasswordOpen: false,
      isCreateUserOpen: false,
      users: null,
      selectedUserId: null,
    };
  }

  public async componentDidMount() {
    await this.initializeRealms();
  }

  public componentWillUnmount() {
    // Remove any existing a change listeners
    if (this.adminRealm) {
      this.adminRealm.removeListener("change", this.onUsersChanged);
    }
  }

  public componentDidUpdate(prevProps: IUsersTableContainerProps, prevState: IUsersTableContainerState) {
    // Fetch the users realm from ROS
    if (prevProps.user !== this.props.user) {
      this.initializeRealms();
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

  public getUser = (index: number): IUser | null => {
    return this.state.users ? this.state.users[index] : null;
  }

  public getUserFromId = (userId: string): IUser | null => {
    return this.adminRealm.objectForPrimaryKey<IUser>("User", userId);
  }

  public getUsersRealms = (userId: string): IRealmFile[] => {
    const realms = this.adminRealm.objects<IRealmFile>("RealmFile").filtered("creatorId = $0", userId);
    return realms.slice();
  }

  public getUsersMetadatas = (userId: string): IUserMetadataRow[] => {
    const user = this.getUserFromId(userId);
    return user ? user.metadata.slice() : [];
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
      this.adminRealm.write(() => {
        const user = this.adminRealm.objectForPrimaryKey<IUser>("User", userId);
        this.adminRealm.delete(user);
      });
      if (userId === this.state.selectedUserId) {
        this.onUserSelected(null);
      }
    }
  }

  public onUserMetadataAppended = (userId: string) => {
    const user = this.getUserFromId(userId);
    if (user) {
      this.adminRealm.write(() => {
        const metadataRow = this.adminRealm.create<IUserMetadataRow>("UserMetadataRow", {
          key: "",
          value: "",
        });
        user.metadata.push(metadataRow);
      });
    }
  }

  public onUserMetadataChanged = (userId: string, index: number, key: string, value: string) => {
    const user = this.getUserFromId(userId);
    if (user && index >= 0 && index < user.metadata.length) {
      this.adminRealm.write(() => {
        user.metadata[index].key = key;
        user.metadata[index].value = value;
      });
    } else {
      throw new Error(`Cannot update users metadata, user not found or index ${index} is out of bounds.`);
    }
  }

  public onUserMetadataDeleted = (userId: string, index: number) => {
    const user = this.getUserFromId(userId);
    if (user && index >= 0 && index < user.metadata.length) {
      this.adminRealm.write(() => {
        this.adminRealm.delete(user.metadata[index]);
      });
    } else {
      throw new Error(`Cannot update users metadata, index ${index} is out of bounds.`);
    }
  }

  public onUserPasswordChanged = (userId: string, password: string) => {
    const success = updateUserPassword(this.props.user, userId, password);
    if (!success) {
      showError("Couldn't update password");
    }
  }

  public onUserRoleChanged = (userId: string, role: UserRole) => {
    const user = this.adminRealm.objectForPrimaryKey<IUser>("User", userId);
    if (user) {
      this.adminRealm.write(() => {
        user.isAdmin = role === UserRole.Administrator;
      });
    } else {
      throw new Error(`Found no user with the id ${userId}`);
    }
  }

  private async initializeRealms() {
    // Remove any existing a change listeners
    if (this.adminRealm) {
      this.adminRealm.removeListener("change", this.onUsersChanged);
    }

    try {
      // Get the realms from the ROS interface
      this.adminRealm = await getAdminRealm(this.props.user);

      // Register change listeners
      this.adminRealm.addListener("change", this.onUsersChanged);

      // Update the users state
      this.updateUsers();
    } catch (err) {
      showError("Could not open the synchronized realms", err);
    }
  }

  private updateUsers() {
    // Get the users
    const users = this.adminRealm.objects<IUser>("User").sorted("userId");
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
