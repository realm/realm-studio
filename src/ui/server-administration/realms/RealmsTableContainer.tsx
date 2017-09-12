import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { deleteRealm, getRealmManagementRealm, IRealmFile } from "../../../services/ros";
import { showError } from "../../reusable/errors";

import { RealmsTable } from "./RealmsTable";

export interface IRealmTableContainerProps {
  user: Realm.Sync.User;
}

export interface IRealmTableContainerState {
  realms: Realm.Results<IRealmFile> | null;
  selectedRealmPath: string | null;
}

export class RealmsTableContainer extends React.Component<IRealmTableContainerProps, IRealmTableContainerState> {

  private realmManagementRealm: Realm;

  constructor() {
    super();
    this.state = {
      realms: null,
      selectedRealmPath: null,
    };
  }

  public componentDidMount() {
    this.initializeRealm();
  }

  public componentWillUnmount() {
    if (this.realmManagementRealm) {
      this.realmManagementRealm.removeListener("change", this.onRealmsChanged);
    }
  }

  public componentDidUpdate(prevProps: IRealmTableContainerProps, prevState: IRealmTableContainerState) {
    // Fetch the realms realm from ROS
    if (prevProps.user !== this.props.user) {
      this.initializeRealm();
    }
  }

  public render() {
    return <RealmsTable
      selectedRealmPath={this.state.selectedRealmPath}
      realmCount={this.state.realms ? this.state.realms.length : 0}
      {...this} />;
  }

  public onRealmSelected = (path: string | null) => {
    this.setState({
      selectedRealmPath: path,
    });
  }

  public getRealm = (index: number): IRealmFile | null => {
    return this.state.realms ? this.state.realms[index] : null;
  }

  public getRealmFromId = (path: string): IRealmFile | null => {
    return this.realmManagementRealm.objectForPrimaryKey<IRealmFile>("RealmFile", path);
  }

  public onRealmDeleted = (path: string) => {
    deleteRealm(path);
    if (path === this.state.selectedRealmPath) {
      this.onRealmSelected(null);
    }
  }

  private async initializeRealm() {
    // Remove any existing a change listener
    if (this.realmManagementRealm) {
      this.realmManagementRealm.removeListener("change", this.onRealmsChanged);
    }
    try {
      this.realmManagementRealm = await getRealmManagementRealm(this.props.user);
      // Get the realms
      const realms = this.realmManagementRealm.objects<IRealmFile>("RealmFile");
      // Set the state
      this.setState({
        realms,
      });
      // Register a change listener
      this.realmManagementRealm.addListener("change", this.onRealmsChanged);
    } catch (err) {
      showError("Could not open the synchronized realm", err);
    }
  }

  private onRealmsChanged = () => {
    this.forceUpdate();
  }
}
