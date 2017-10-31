import * as React from 'react';

import {
  createUser,
  getRealm,
  IAdminTokenCredentials,
  ILocalRealmToLoad,
  IRealmFile,
  IServerCredentials,
  ISyncedRealmToLoad,
  IUser,
  IUserMetadataRow,
  IUsernamePasswordCredentials,
  RealmLoadingMode,
  updateUserPassword,
} from '../../../services/ros';

import { showError } from '../errors';
import { ILoadingProgress } from '../loading-overlay';

export interface IRealmLoadingComponentState {
  progress: ILoadingProgress;
  realm?: ISyncedRealmToLoad | ILocalRealmToLoad;
}

export abstract class RealmLoadingComponent<
  P,
  S extends IRealmLoadingComponentState
> extends React.Component<P, S> {
  protected abstract onRealmChanged: () => void;
  protected abstract onRealmLoaded: () => void;

  protected realm: Realm;
  protected cancellations: Array<() => void> = [];

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

  protected async loadRealm(
    realm: ISyncedRealmToLoad | ILocalRealmToLoad,
    encryptionKey?: Uint8Array,
  ) {
    // Remove any existing a change listeners
    if (this.realm) {
      this.realm.removeListener('change', this.onRealmChanged);
    }

    if (realm) {
      try {
        this.setState({ progress: { done: false } });
        // Get the realms from the ROS interface
        this.realm = await this.openRealm(realm, encryptionKey);
        // Register change listeners
        this.realm.addListener('change', this.onRealmChanged);
        this.onRealmLoaded();
        // Update the state, to indicate we're done loading
        this.setState({ progress: { done: true } });
      } catch (err) {
        if (!err.wasCancelled) {
          this.loadingRealmFailed(err);
        }
      }
    }
  }

  protected loadingRealmFailed(err: Error) {
    showError('Failed open the Realm', err);
    const failure = err.message || 'Failed to open the Realm';
    this.setState({ progress: { failure, done: true } });
  }

  private async openRealm(
    realm: ISyncedRealmToLoad | ILocalRealmToLoad | undefined,
    encryptionKey?: Uint8Array,
  ): Promise<Realm> {
    if (realm && realm.mode === RealmLoadingMode.Local) {
      return new Realm({ path: realm.path, encryptionKey });
    } else if (realm && realm.mode === RealmLoadingMode.Synced) {
      const props = (realm as any) as ISyncedRealmToLoad;
      const user =
        props.authentication instanceof Realm.Sync.User
          ? props.authentication
          : await this.getRealmLoadingUser(props.authentication);
      const realmPromise = getRealm(
        user,
        realm.path,
        encryptionKey,
        this.progressChanged,
      );
      // Save a wrapping promise so this can be cancelled
      return new Promise<Realm>((resolve, reject) => {
        this.cancellations.push(() => reject({ wasCancelled: true }));
        realmPromise.then(resolve, reject);
      });
    } else if (!realm) {
      throw new Error(`Called without a realm to load`);
    } else {
      throw new Error(`Unexpected mode ${realm.mode}`);
    }
  }

  private async getRealmLoadingUser(
    credentials: IServerCredentials,
  ): Promise<Realm.Sync.User> {
    return new Promise<Realm.Sync.User>(async (resolve, reject) => {
      if (!credentials) {
        reject(new Error('Missing credentials'));
      }
      if ('token' in credentials) {
        const tokenCredentials = credentials as IAdminTokenCredentials;
        const user = Realm.Sync.User.adminUser(
          tokenCredentials.token,
          tokenCredentials.url,
        );
        resolve(user);
      } else if ('username' in credentials && 'password' in credentials) {
        const passwordCredentials = credentials as IUsernamePasswordCredentials;
        try {
          const user = await Realm.Sync.User.login(
            passwordCredentials.url,
            passwordCredentials.username,
            passwordCredentials.password,
          );
          resolve(user);
        } catch (err) {
          showError(`Couldn't connect to Realm Object Server`, err, {
            'Failed to fetch': 'Could not reach the server',
          });
          reject(err);
        }
      }
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
