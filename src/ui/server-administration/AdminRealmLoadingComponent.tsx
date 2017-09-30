import * as React from 'react';

import {
  createUser,
  getAdminRealm,
  IRealmFile,
  IUser,
  IUserMetadataRow,
  updateUserPassword,
} from '../../services/ros';

import { showError } from '../reusable/errors';

export interface IAdminRealmLoadingComponentProps {
  user: Realm.Sync.User;
}

export interface IAdminRealmLoadingComponentState {
  hasLoaded: boolean;
}

export abstract class AdminRealmLoadingComponent<
  P extends IAdminRealmLoadingComponentProps,
  S extends IAdminRealmLoadingComponentState
> extends React.Component<P, S> {
  protected abstract onAdminRealmChanged: () => void;
  protected abstract onAdminRealmLoaded: () => void;
  protected adminRealm: Realm;
  protected cancellations: Array<() => void> = [];

  public async componentDidMount() {
    await this.initializeRealm();
  }

  public componentWillUnmount() {
    // Remove any existing a change listeners
    if (this.adminRealm) {
      this.adminRealm.removeListener('change', this.onAdminRealmChanged);
    }
    this.cancelLoadingRealms();
  }

  protected cancelLoadingRealms() {
    // Iterate over everything that can be cancelled
    this.cancellations.forEach(cancel => cancel());
  }

  protected async initializeRealm() {
    // Remove any existing a change listeners
    if (this.adminRealm) {
      this.adminRealm.removeListener('change', this.onAdminRealmChanged);
    }

    try {
      this.setState({ hasLoaded: false });
      // Get the realms from the ROS interface
      this.adminRealm = await this.getAdminRealm();

      // Register change listeners
      this.adminRealm.addListener('change', this.onAdminRealmChanged);
      this.onAdminRealmLoaded();
      // Update the state, to indicate we're done loading
      this.setState({ hasLoaded: true });
    } catch (err) {
      if (!err.wasCancelled) {
        showError('Failed to synchronize Realms with the server', err);
        this.setState({ hasLoaded: true });
      }
    }
  }

  private getAdminRealm(): Promise<Realm> {
    const realmPromise = getAdminRealm(this.props.user);
    return new Promise((resolve, reject) => {
      this.cancellations.push(() => reject({ wasCancelled: true }));
      realmPromise.then(resolve, reject);
    });
  }
}
