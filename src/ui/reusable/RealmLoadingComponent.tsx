import * as React from 'react';

import {
  createUser,
  getRealm,
  IRealmFile,
  IUser,
  IUserMetadataRow,
  updateUserPassword,
} from '../../services/ros';

import { showError } from './errors';
import { ILoadingProgress } from './loading-overlay';

export { ILoadingProgress };

export interface IRealmLoadingComponentProps {
  user: Realm.Sync.User;
}

export interface IRealmLoadingComponentState {
  progress: ILoadingProgress;
}

export abstract class RealmLoadingComponent<
  P extends IRealmLoadingComponentProps,
  S extends IRealmLoadingComponentState
> extends React.Component<P, S> {
  protected abstract onRealmChanged: () => void;
  protected abstract onRealmLoaded: () => void;

  protected realm: Realm;
  protected cancellations: Array<() => void> = [];

  private realmPath: string;

  public constructor(realmPath: string) {
    super();
    this.realmPath = realmPath;
  }

  public async componentDidMount() {
    await this.initializeRealm();
  }

  public componentWillUnmount() {
    // Remove any existing a change listeners
    if (this.realm) {
      this.realm.removeListener('change', this.onRealmChanged);
    }
    this.cancelLoadingRealms();
  }

  protected cancelLoadingRealms() {
    // Iterate over everything that can be cancelled
    this.cancellations.forEach(cancel => cancel());
  }

  protected async initializeRealm() {
    // Remove any existing a change listeners
    if (this.realm) {
      this.realm.removeListener('change', this.onRealmChanged);
    }

    try {
      this.setState({ progress: { done: false } });
      // Get the realms from the ROS interface
      this.realm = await this.openRealm();

      // Register change listeners
      this.realm.addListener('change', this.onRealmChanged);
      this.onRealmLoaded();
      // Update the state, to indicate we're done loading
      this.setState({ progress: { done: true } });
    } catch (err) {
      if (!err.wasCancelled) {
        showError('Failed to synchronize Realms with the server', err);
        const failure = err.message || 'Failed to open the Realm';
        this.setState({ progress: { failure, done: true } });
      }
    }
  }

  private openRealm(): Promise<Realm> {
    const realmPromise = getRealm(
      this.props.user,
      this.realmPath,
      this.progressChanged,
    );
    // Save a wrapping promise so this can be cancelled
    return new Promise((resolve, reject) => {
      this.cancellations.push(() => reject({ wasCancelled: true }));
      realmPromise.then(resolve, reject);
    });
  }

  private progressChanged = (transferred: number, transferable: number) => {
    // console.log('progressChanged', transferred, transferable);
    this.setState({
      progress: {
        done: transferred >= transferable,
        transferred,
        transferable,
      },
    });
  };
}
