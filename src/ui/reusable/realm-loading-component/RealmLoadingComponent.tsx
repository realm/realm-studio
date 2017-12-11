import * as electron from 'electron';
import * as React from 'react';

import {
  IAdminTokenCredentials,
  IRealmFile,
  IServerCredentials,
  IUser,
  IUserMetadataRow,
  IUsernamePasswordCredentials,
  realms,
  users,
} from '../../../services/ros';

import { showError } from '../errors';
import { ILoadingProgress } from '../loading-overlay';

export interface IRealmLoadingComponentState {
  progress: ILoadingProgress;
  realm?: realms.ISyncedRealmToLoad | realms.ILocalRealmToLoad;
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
    realm: realms.ISyncedRealmToLoad | realms.ILocalRealmToLoad,
  ) {
    // Remove any existing a change listeners
    if (this.realm) {
      this.realm.removeListener('change', this.onRealmChanged);
    }

    const validateCertificates =
      realm.mode === 'synced' && realm.validateCertificates;

    if (realm) {
      try {
        this.setState({ progress: { done: false } });
        // Reset the state that captures rejected certificates
        this.certificateWasRejected = false;
        // Get the realms from the ROS interface
        this.realm = await this.openRealm(realm, {
          errorCallback: this.onSyncError,
          validateCertificates,
          // Uncomment the line below to test failing certificate validation
          /*
          certificatePath: '... some path of a valid but failing certificate',
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
          if (validateCertificates && this.certificateWasRejected) {
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
              this.loadRealm({
                ...realm,
                validateCertificates: false,
              });
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
    realm: realms.ISyncedRealmToLoad | realms.ILocalRealmToLoad | undefined,
    ssl: realms.ISslConfiguration = { validateCertificates: true },
  ): Promise<Realm> {
    if (realm && realm.mode === realms.RealmLoadingMode.Local) {
      try {
        return new Realm({
          path: realm.path,
          encryptionKey: realm.encryptionKey,
          sync: realm.sync as any,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            'Incompatible histories. Expected a Realm with no or in-realm history',
          ) &&
          realm.sync !== true
        ) {
          // Try to open the Realm locally with a sync history mode.
          return this.openRealm({ ...realm, sync: true }, ssl);
        }
        // Other errors, propagate it.
        throw error;
      }
    } else if (realm && realm.mode === realms.RealmLoadingMode.Synced) {
      const props = (realm as any) as realms.ISyncedRealmToLoad;
      const user =
        props.authentication instanceof Realm.Sync.User
          ? props.authentication
          : await users.authenticate(props.authentication);
      const realmPromise = realms.open(
        user,
        realm.path,
        realm.encryptionKey,
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
