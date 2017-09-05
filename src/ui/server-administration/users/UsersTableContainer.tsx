import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { deleteUser, getAuthRealm, IAuthUser, IAuthUserMetadata, updateUser } from "../../../services/ros";

import { UserRole, UsersTable } from "./UsersTable";

export interface IUsersTableContainerProps {
  user: Realm.Sync.User;
}

export interface IUsersTableContainerState {
  users: Realm.Results<IAuthUser> | null;
  selectedUserId: string | null;
}

export class UsersTableContainer extends React.Component<IUsersTableContainerProps, IUsersTableContainerState> {

  private authRealm: Realm;

  constructor() {
    super();
    this.state = {
      users: null,
      selectedUserId: null,
    };
  }

  public componentDidMount() {
    this.initializeRealm();
  }

  public componentWillUnmount() {
    this.authRealm.removeListener("change", this.onUsersChanged);
  }

  public componentDidUpdate(prevProps: IUsersTableContainerProps, prevState: IUsersTableContainerState) {
    // Fetch the users realm from ROS
    if (prevProps.user !== this.props.user) {
      this.initializeRealm();
    }
  }

  public render() {
    return <UsersTable
      selectedUserId={this.state.selectedUserId}
      selectedUsersMetadatas={this.getSelectedUsersMetadatas()}
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

  public onUserDeleted = (userId: string) => {
    deleteUser(userId);
    if (userId === this.state.selectedUserId) {
      this.onUserSelected(null);
    }
  }

  public onUserRoleChanged = (userId: string, role: UserRole) => {
    updateUser(userId, {
      isAdmin: role === UserRole.Administrator,
    });
  }

  private initializeRealm() {
    // Remove any existing a change listener
    if (this.authRealm) {
      this.authRealm.removeListener("change", this.onUsersChanged);
    }
    this.authRealm = getAuthRealm(this.props.user);
    // Get the users
    const users = this.authRealm.objects<IAuthUser>("AuthUser"); // .sorted("isAdmin", true);
    // Set the state
    this.setState({
      users,
    });
    // Register a change listener
    this.authRealm.addListener("change", this.onUsersChanged);
  }

  private onUsersChanged = () => {
    this.forceUpdate();
  }

  private getSelectedUsersMetadatas = (): IAuthUserMetadata[] => {
    if (this.authRealm && this.state.users && this.state.selectedUserId !== null) {
      const userId = this.state.selectedUserId;
      const metadata = this.authRealm.objects<IAuthUserMetadata>("AuthUserMetadata").filtered("userId = $0", userId);
      return metadata.slice();
    } else {
      return [];
    }
  }
}
