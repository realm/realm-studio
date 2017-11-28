import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import * as ros from '../../../services/ros';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../../reusable/realm-loading-component';

import { showError } from '../../reusable/errors';
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
  realms: Realm.Results<ros.IRealmFile> | null;
  selectedRealmPath: string | null;
  isCreateRealmOpen: boolean;
}

export class RealmsTableContainer extends RealmLoadingComponent<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  constructor() {
    super();
    this.state = {
      realms: null,
      isCreateRealmOpen: false,
      selectedRealmPath: null,
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

  public getRealm = (index: number): ros.IRealmFile | null => {
    return this.state.realms ? this.state.realms[index] : null;
  };

  public getRealmFromId = (path: string): ros.IRealmFile | null => {
    return this.realm.objectForPrimaryKey<ros.IRealmFile>('RealmFile', path);
  };

  public onRealmDeletion = async (path: string) => {
    const confirmed = await this.confirmRealmDeletion(path);
    if (confirmed) {
      try {
        await ros.realms.remove(this.props.user, path);
        if (path === this.state.selectedRealmPath) {
          this.onRealmSelected(null);
        }
      } catch (err) {
        showError('Error deleting realm', err);
      }
    }
  };

  public onRealmCreated = async (path: string) => {
    ros.realms.create(this.props.user, path);
  };

  public toggleCreateRealm = () => {
    this.setState({
      isCreateRealmOpen: !this.state.isCreateRealmOpen,
    });
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
      mode: ros.realms.RealmLoadingMode.Synced,
      path: '__admin',
      validateCertificates: this.props.validateCertificates,
    });
  }

  protected async loadRealm(
    realm: ros.realms.ISyncedRealmToLoad | ros.realms.ILocalRealmToLoad,
  ) {
    if (
      this.certificateWasRejected &&
      realm.mode === 'synced' &&
      !realm.validateCertificates
    ) {
      // TODO: Remove this hack once this Realm JS issue has resolved:
      // https://github.com/realm/realm-js/issues/1469
      this.props.onValidateCertificatesChange(realm.validateCertificates);
    } else {
      return super.loadRealm(realm);
    }
  }

  protected onRealmChanged = () => {
    this.forceUpdate();
  };

  protected onRealmLoaded = () => {
    // Get the realms and save them in the state
    this.setState({
      realms: this.realm.objects<ros.IRealmFile>('RealmFile'),
    });
  };

  private confirmRealmDeletion(path: string): boolean {
    const result = electron.remote.dialog.showMessageBox(
      electron.remote.getCurrentWindow(),
      {
        type: 'warning',
        message:
          'Before deleting the Realm here, make sure that any / all clients (iOS, Android, Js, etc.) has already deleted the app or database locally. If this is not done, they will try to upload their copy of the database - which might have been replaced in the meantime.',
        title: `Deleting ${path}`,
        buttons: ['Cancel', 'Delete'],
      },
    );

    return result === 1;
  }
}
