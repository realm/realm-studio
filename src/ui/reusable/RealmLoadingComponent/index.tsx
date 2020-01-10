////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import electron from 'electron';
import React from 'react';

import { realms } from '../../../services/ros';
import { RealmLoadingMode, RealmToLoad } from '../../../utils/realms';
import { ILoadingProgress } from '../LoadingOverlay';

export interface IRealmLoadingComponentState {
  progress: ILoadingProgress;
}

const TRUST_DIALOG_MESSAGE =
  'The servers SSL certificate failed validation:\n\nDo you want to retry without validating the certificate?';

export abstract class RealmLoadingComponent<
  P,
  S extends IRealmLoadingComponentState
> extends React.Component<P, S> {
  protected abstract onRealmChanged: () => void;
  protected abstract onRealmLoaded: () => void;

  protected realm?: Realm;
  protected cancellations: Array<() => void> = [];
  protected certificateWasRejected: boolean = false;

  public componentWillUnmount() {
    // Closing and remove any existing a change listeners
    if (this.realm) {
      this.realm.removeListener('change', this.onRealmChanged);
      this.realm.close();
      // Deleting indicates we've closed it
      delete this.realm;
    }
    this.closeRealm();
    this.cancelLoadingRealms();
  }

  protected cancelLoadingRealms() {
    // Iterate over everything that can be cancelled
    this.cancellations.forEach(cancel => cancel());
  }

  protected async loadRealm(
    realm: RealmToLoad,
    schema?: Realm.ObjectSchema[],
    schemaVersion?: number,
  ) {
    // Close the realm - if open
    this.closeRealm();

    // Should certificates get validated?
    const validateCertificates =
      realm.mode === 'synced' && realm.validateCertificates;

    if (realm) {
      try {
        this.setState({ progress: { status: 'in-progress' } });
        // Reset the state that captures rejected certificates
        this.certificateWasRejected = false;
        // Get the realms from the ROS interface
        this.realm = await this.openRealm(
          realm,
          {
            errorCallback: this.onSyncError,
            validateCertificates,
            // Uncomment the line below to test failing certificate validation
            /*
            certificatePath: '... some path of a valid but failing certificate',
            */
          },
          schema,
          schemaVersion,
        );

        // Register change listeners
        this.realm.addListener('change', this.onRealmChanged);
        this.onRealmLoaded();
        // Update the state, to indicate we're done loading
        this.setState({ progress: { status: 'done' } });
      } catch (err) {
        // Ignore an error that originates from the load being cancelled
        if (!err.wasCancelled) {
          // Could this error originate from an untrusted SSL certificate?
          if (
            validateCertificates &&
            this.certificateWasRejected &&
            realm.mode === RealmLoadingMode.Synced
          ) {
            // Ask the user if they want to trust the certificate
            const result = electron.remote.dialog.showMessageBoxSync(
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
        } // ignore errors from cancelled loading
      }
    }
  }

  protected closeRealm() {
    // Remove any existing a change listeners
    if (this.realm) {
      this.realm.removeListener('change', this.onRealmChanged);
      this.realm.close();
      delete this.realm;
    }
  }

  protected loadingRealmFailed(err: Error) {
    const message = err.message || 'Failed to open the Realm';
    this.setState({ progress: { message, status: 'failed' } });
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
    } else if (error.isFatal === false) {
      /* tslint:disable-next-line:no-console */
      console.warn(`A non-fatal sync error happened: ${error.message}`, error);
    } else {
      this.setState({
        progress: {
          message: error.message,
          status: 'failed',
        },
      });
    }
  };

  private async openRealm(
    realm: RealmToLoad | undefined,
    ssl: realms.ISslConfiguration = { validateCertificates: true },
    schema?: Realm.ObjectSchema[],
    schemaVersion?: number,
  ): Promise<Realm> {
    if (realm && realm.mode === RealmLoadingMode.Local) {
      try {
        return new Realm({
          path: realm.path,
          encryptionKey: realm.encryptionKey,
          disableFormatUpgrade: realm.enableFormatUpgrade ? false : true,
          sync: realm.sync as any,
          schema,
          schemaVersion,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('Incompatible histories.') &&
          realm.sync !== true
        ) {
          // Try to open the Realm locally with a sync history mode.
          return this.openRealm(
            { ...realm, sync: true },
            ssl,
            schema,
            schemaVersion,
          );
        }
        // Other errors, propagate it.
        throw error;
      }
    }

    if (realm && realm.mode === RealmLoadingMode.Synced) {
      const realmPromise = realms.open({
        user: Realm.Sync.User.deserialize(realm.user),
        realmPath: realm.path,
        encryptionKey: realm.encryptionKey,
        ssl,
        progressCallback: this.progressChanged,
        schema,
      });
      // Save a wrapping promise so this can be cancelled
      return new Promise<Realm>((resolve, reject) => {
        this.cancellations.push(() => reject({ wasCancelled: true }));
        realmPromise.then(resolve, reject);
      });
    }

    if (!realm) {
      throw new Error(`Called without a realm to load`);
    }

    throw new Error('Unexpected mode');
  }

  private progressChanged = (transferred: number, transferable: number) => {
    // Don't change the progress if a failure has occurred
    if (this.state.progress.status !== 'failed') {
      this.setState({
        progress: {
          message: 'Downloading Realm',
          status: transferred >= transferable ? 'done' : 'in-progress',
          transferred,
          transferable,
        },
      });
    }
  };
}
