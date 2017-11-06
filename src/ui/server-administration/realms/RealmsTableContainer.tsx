import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import {
  deleteRealm,
  ILocalRealmToLoad,
  IRealmFile,
  ISyncedRealmToLoad,
  RealmLoadingMode,
} from '../../../services/ros';
import { showError } from '../../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../../reusable/realm-loading-component';

import { RealmsTable } from './RealmsTable';

export type ValidateCertificatesChangeHandler = (
  validateCertificates: boolean,
) => void;

export interface IRealmTableContainerProps {
  onRealmOpened: (path: string) => void;
  user: Realm.Sync.User;
  validateCertificates: boolean;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
}

export interface IRealmTableContainerState extends IRealmLoadingComponentState {
  realms: Realm.Results<IRealmFile> | null;
  selectedRealmPath: string | null;
}

export class RealmsTableContainer extends RealmLoadingComponent<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  constructor() {
    super();
    this.state = {
      realms: null,
      selectedRealmPath: null,
      progress: {
        done: false,
      },
    };
  }

  public componentDidMount() {
    // Tell the RealmLoadingComponent to not validate certificates based on the property
    this.validateCertificates = this.props.validateCertificates;
    if (this.props.user) {
      this.gotUser(this.props.user);
    }
  }

  public componentDidUpdate(
    prevProps: IRealmTableContainerProps,
    prevState: IRealmTableContainerState,
  ) {
    // Fetch the realms realm from ROS
    if (prevProps.user !== this.props.user) {
      this.gotUser(this.props.user);
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

  protected gotUser(user: Realm.Sync.User) {
    this.loadRealm({
      authentication: this.props.user,
      mode: RealmLoadingMode.Synced,
      path: '__admin',
    });
  }

  protected async loadRealm(
    realm: ISyncedRealmToLoad | ILocalRealmToLoad,
    encryptionKey?: Uint8Array,
  ) {
    if (this.certificateWasRejected && !this.validateCertificates) {
      // TODO: Remove this hack once this Realm JS issue has resolved:
      // https://github.com/realm/realm-js/issues/1469
      this.props.onValidateCertificatesChange(this.validateCertificates);
    } else {
      return super.loadRealm(realm, encryptionKey);
    }
  }

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
