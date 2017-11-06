import * as electron from 'electron';
import * as React from 'react';

import {
  authenticate,
  createUser,
  getRealm,
  IAdminTokenCredentials,
  ILocalRealmToLoad,
  IRealmFile,
  IServerCredentials,
  ISslConfiguration,
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

const TRUST_DIALOG_MESSAGE =
  'The servers SSL certificate failed validation:\n\nDo you want to retry without validating the certificate?';

export abstract class RealmLoadingComponent<
  P,
  S extends IRealmLoadingComponentState
> extends React.Component<P, S> {
  protected abstract onRealmChanged: () => void;
  protected abstract onRealmLoaded: () => void;

  protected realm: Realm;
  protected cancellations: Array<() => void> = [];
  protected validateCertificates: boolean = true;
  protected certificateWasRejected: boolean;

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
        // Reset the state that captures rejected certificates
        this.certificateWasRejected = false;
        // Get the realms from the ROS interface
        this.realm = await this.openRealm(realm, encryptionKey, {
          errorCallback: this.onSyncError,
          validateCertificates: this.validateCertificates,
          // Uncomment the line below to test failing certificate validation
          /*
          certificatePath:
            '/Users/kraenhansen/Repositories/realm-studio/data/keys/server.crt',
          */
        });
        // Register change listeners
        this.realm.addListener('change', this.onRealmChanged);
        this.onRealmLoaded();
        // Update the state, to indicate we're done loading
        this.setState({ progress: { done: true } });
      } catch (err) {
        // Ignore an error that originates from the load being cancelled
        if (!err.wasCancelled) {
          // Could this error originate from an untrusted SSL certificate?
          if (this.validateCertificates && this.certificateWasRejected) {
            // Ask the user if they want to trust the certificate
            const result = electron.remote.dialog.showMessageBox(
              electron.remote.getCurrentWindow(),
              {
                type: 'warning',
                message: TRUST_DIALOG_MESSAGE,
                buttons: ['Retry, without validating certificate', 'Cancel'],
              },
            );
            if (result === 0) {
              this.validateCertificates = false;
              this.loadRealm(realm, encryptionKey);
            } else {
              this.loadingRealmFailed(err);
            }
          } else {
            this.loadingRealmFailed(err);
          }
        }
      }
    }
  }

  protected loadingRealmFailed(err: Error) {
    showError('Failed open the Realm', err);
    const failure = err.message || 'Failed to open the Realm';
    this.setState({ progress: { failure, done: true } });
  }

  protected isSslCertificateRelated(err: Error) {
    return err && err.message === 'SSL server certificate rejected';
  }

  protected onSyncError = (
    session: Realm.Sync.Session,
    error: Realm.Sync.SyncError,
  ) => {
    if (error.message === 'SSL server certificate rejected') {
      this.certificateWasRejected = true;
    } else {
      showError('Failed while synchronizing Realm', error);
    }
  };

  private async openRealm(
    realm: ISyncedRealmToLoad | ILocalRealmToLoad | undefined,
    encryptionKey?: Uint8Array,
    ssl: ISslConfiguration = { validateCertificates: true },
  ): Promise<Realm> {
    if (realm && realm.mode === RealmLoadingMode.Local) {
      return new Realm({ path: realm.path, encryptionKey });
    } else if (realm && realm.mode === RealmLoadingMode.Synced) {
      const props = (realm as any) as ISyncedRealmToLoad;
      const user =
        props.authentication instanceof Realm.Sync.User
          ? props.authentication
          : await authenticate(props.authentication);
      const realmPromise = getRealm(
        user,
        realm.path,
        encryptionKey,
        ssl,
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
      throw new Error('Unexpected mode');
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
    this.setState({
      progress: {
        done: transferred >= transferable,
        transferred,
        transferable,
      },
    });
  };
}
