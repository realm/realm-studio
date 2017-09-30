import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { deleteRealm, IRealmFile } from '../../../services/ros';
import { showError } from '../../reusable/errors';
import {
  ILoadingProgress,
  RealmLoadingComponent,
} from '../../reusable/RealmLoadingComponent';

import { RealmsTable } from './RealmsTable';

export interface IRealmTableContainerProps {
  user: Realm.Sync.User;
  onRealmOpened: (path: string) => void;
}

export interface IRealmTableContainerState {
  realms: Realm.Results<IRealmFile> | null;
  selectedRealmPath: string | null;
  progress: ILoadingProgress;
}

export class RealmsTableContainer extends RealmLoadingComponent<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  constructor() {
    super('__admin');
    this.state = {
      realms: null,
      selectedRealmPath: null,
      progress: {
        done: false,
      },
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
    return this.realm.objectForPrimaryKey<IRealmFile>('RealmFile', path);
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

  protected onRealmChanged = () => {
    this.forceUpdate();
  };

  protected onRealmLoaded = () => {
    // Get the realms and save them in the state
    this.setState({
      realms: this.realm.objects<IRealmFile>('RealmFile'),
    });
  };
}
