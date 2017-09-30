import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { deleteRealm, getAdminRealm, IRealmFile } from '../../../services/ros';
import { showError } from '../../reusable/errors';
import { AdminRealmLoadingComponent } from '../AdminRealmLoadingComponent';

import { RealmsTable } from './RealmsTable';

export interface IRealmTableContainerProps {
  user: Realm.Sync.User;
  onRealmOpened: (path: string) => void;
}

export interface IRealmTableContainerState {
  hasLoaded: boolean;
  realms: Realm.Results<IRealmFile> | null;
  selectedRealmPath: string | null;
}

export class RealmsTableContainer extends AdminRealmLoadingComponent<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  constructor() {
    super();
    this.state = {
      hasLoaded: false,
      realms: null,
      selectedRealmPath: null,
    };
  }

  public componentDidUpdate(
    prevProps: IRealmTableContainerProps,
    prevState: IRealmTableContainerState,
  ) {
    // Fetch the realms realm from ROS
    if (prevProps.user !== this.props.user) {
      this.initializeRealm();
    }
  }

  public render() {
    return (
      <RealmsTable
        realmCount={this.state.realms ? this.state.realms.length : 0}
        {...this.state}
        {...this}
      />
    );
  }

  public getRealm = (index: number): IRealmFile | null => {
    return this.state.realms ? this.state.realms[index] : null;
  };

  public getRealmFromId = (path: string): IRealmFile | null => {
    return this.adminRealm.objectForPrimaryKey<IRealmFile>('RealmFile', path);
  };

  public onRealmDeleted = (path: string) => {
    deleteRealm(path);
    if (path === this.state.selectedRealmPath) {
      this.onRealmSelected(null);
    }
  };

  public onRealmOpened = (path: string) => {
    this.props.onRealmOpened(path);
  };

  public onRealmSelected = (path: string | null) => {
    this.setState({
      selectedRealmPath: path,
    });
  };

  protected onAdminRealmChanged = () => {
    this.forceUpdate();
  };

  protected onAdminRealmLoaded = () => {
    // Get the realms and save them in the state
    this.setState({
      realms: this.adminRealm.objects<IRealmFile>('RealmFile'),
    });
  };
}
