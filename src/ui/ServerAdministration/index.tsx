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

import * as electron from 'electron';
import * as os from 'os';
import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../actions/main';
import { ICloudStatus } from '../../main/CloudManager';
import {
  IAdminTokenCredentials,
  IRealmFile,
  isAvailable,
  IUser,
  IUsernamePasswordCredentials,
  realms,
  users,
} from '../../services/ros';
import { countdown, wait } from '../../utils';
import { IServerAdministrationWindowProps } from '../../windows/WindowProps';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/RealmLoadingComponent';

import { ValidateCertificatesChangeHandler } from './RealmsTable';
import { ServerAdministration, Tab } from './ServerAdministration';

export interface IServerAdministrationContainerProps
  extends IServerAdministrationWindowProps {
  isCloudTenant?: boolean;
}

export interface IServerAdministrationContainerState
  extends IRealmLoadingComponentState {
  activeTab: Tab | null;
  // This will increment when the realm changes to trigger updates to the UI.
  adminRealmChanges: number;
  isRealmOpening: boolean;
  user: Realm.Sync.User | null;
  serverVersion?: string;
}

class ServerAdministrationContainer extends RealmLoadingComponent<
  IServerAdministrationContainerProps,
  IServerAdministrationContainerState
> {
  public state: IServerAdministrationContainerState = {
    activeTab: null,
    adminRealmChanges: 0,
    isRealmOpening: false,
    progress: { status: 'idle' },
    user: null,
  };

  protected availabilityPromise?: Promise<string | undefined>;

  public async componentDidMount() {
    // Start listening on changes to the cloud-status
    electron.ipcRenderer.on('cloud-status', this.cloudStatusChanged);

    await this.authenticate();

    if (this.props.isCloudTenant) {
      this.setState({
        activeTab: Tab.GettingStarted,
      });
    } else {
      this.setState({
        activeTab: Tab.Realms,
      });
    }
  }

  public async componentWillUpdate(
    nextProps: IServerAdministrationContainerProps,
    nextState: IServerAdministrationContainerState,
  ) {
    if (nextState.user && this.state.user !== nextState.user) {
      this.gotUser(nextState.user);
    }
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'cloud-status',
      this.cloudStatusChanged,
    );
  }

  public render() {
    return (
      <ServerAdministration
        {...this.state}
        {...this}
        adminRealm={this.realm}
        adminRealmChanges={this.state.adminRealmChanges}
        adminRealmProgress={this.state.progress}
        isCloudTenant={this.props.isCloudTenant || false}
        onValidateCertificatesChange={this.onValidateCertificatesChange}
        validateCertificates={this.props.validateCertificates}
      />
    );
  }

  // TODO: Once the user serializes better, this method should be moved to the ./realms/RealmsTableContainer.tsx
  public onRealmOpened = async (path: string) => {
    if (!this.state.isRealmOpening) {
      this.setState({ isRealmOpening: true });
      // Let the UI update before sync waiting on the window to appear
      const realm: realms.ISyncedRealmToLoad = {
        authentication: this.props.credentials,
        mode: realms.RealmLoadingMode.Synced,
        path,
        validateCertificates: this.props.validateCertificates,
      };
      await main.showRealmBrowser({ realm });
      this.setState({ isRealmOpening: false });
    }
  };

  public onReconnect = async () => {
    // TODO: Use reopen the Realm instead of reloading
    /*
    this.setState({ syncError: undefined });
    this.authenticate();
    */
    await this.ensureServerIsAvailable(this.props.credentials.url);
    location.reload();
  };

  public onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  protected async authenticate() {
    try {
      // Ensure the server is available before authenticating ..
      const version = await this.ensureServerIsAvailable(
        this.props.credentials.url,
      );

      const compatible = this.isCompatibleVersion(version);
      if (!compatible) {
        this.failWithIncompatibleVersion(version);
        return;
      }

      this.setState({
        serverVersion: version,
        progress: {
          status: 'in-progress',
          message: 'Authenticating',
        },
      });
      // Authenticate towards the server
      const user = await users.authenticate(this.props.credentials);
      this.setState({
        progress: {
          status: 'in-progress',
          message: 'Authenticated',
        },
        user,
      });
    } catch (err) {
      const message = this.getAuthenticationErrorMessage(err);
      this.setState({
        progress: {
          status: 'failed',
          message,
          retry: {
            label: 'Retry',
            onRetry: this.onReconnect,
          },
        },
      });
    }
  }

  protected async ensureServerIsAvailable(
    url: string,
  ): Promise<string | undefined> {
    // Return a previous promise if that's available
    if (!this.availabilityPromise) {
      this.availabilityPromise = new Promise(async resolve => {
        while (true) {
          try {
            this.setState({
              progress: {
                status: 'in-progress',
                message: `Checking availability`,
              },
            });
            const availability = await isAvailable(url);
            if (availability.available) {
              // Let's resolve the promise, delete it and break the endless loop
              resolve(availability.version);
              delete this.availabilityPromise;
              return;
            } else {
              throw new Error('Not available ...');
            }
          } catch (err) {
            await wait(500); // Wait to show we're checking ...
            // Errors probably means it's unavailable - let's retry
            await countdown(1000, 3, n => {
              const plural = n >= 1 ? 's' : '';
              this.setState({
                progress: {
                  status: 'in-progress',
                  message: `The server is not available, retrying in ${n} second${plural}`,
                },
              });
            });
          }
        }
      });
    }
    return this.availabilityPromise;
  }

  protected getAuthenticationErrorMessage(err: Error) {
    if (err.message === 'Failed to fetch') {
      return 'Failed to fetch:\nIs the server started?';
    } else {
      return err.message || 'Failed to authenticate';
    }
  }

  protected async gotUser(user: Realm.Sync.User) {
    try {
      this.setState({
        progress: {
          status: 'in-progress',
          message: 'Opening __admin Realm',
        },
      });
      await this.loadRealm({
        authentication: user,
        mode: realms.RealmLoadingMode.Synced,
        path: '__admin',
        validateCertificates: this.props.validateCertificates,
      });
    } catch (err) {
      this.setState({
        progress: {
          status: 'failed',
          message: `Failed to open the __admin Realm: ${err.message}`,
        },
      });
    }
  }

  protected async loadRealm(
    realm: realms.ISyncedRealmToLoad | realms.ILocalRealmToLoad,
  ) {
    if (
      this.certificateWasRejected &&
      realm.mode === 'synced' &&
      !realm.validateCertificates
    ) {
      // TODO: Remove this hack once this Realm JS issue has resolved:
      // https://github.com/realm/realm-js/issues/1469
      this.onValidateCertificatesChange(realm.validateCertificates);
    } else {
      return super.loadRealm(realm);
    }
  }

  protected isCompatibleVersion(version?: string) {
    return typeof version === 'string' && version.charAt(0) === '3';
  }

  protected failWithIncompatibleVersion(version?: string) {
    this.setState({
      serverVersion: version,
      progress: {
        status: 'failed',
        message: `You are connecting to an old Realm Object Server,
          no longer supported by Realm Studio.\n
          You can download an older compatible version of Realm Studio,
          which won't receive updates.`,
        retry: {
          label: 'Downgrade Realm Studio',
          onRetry: this.onDowngradeStudio,
        },
      },
    });
  }

  protected downgradedStudioUrl() {
    const baseUrl = 'https://studio-releases.realm.io/v1.19.2-ros2';
    const platform = os.platform();
    if (platform === 'darwin') {
      return `${baseUrl}/download/mac-dmg`;
    } else if (platform === 'linux') {
      return `${baseUrl}/download/linux-appimage`;
    } else if (platform === 'win32') {
      return `${baseUrl}/download/win-setup`;
    } else {
      return baseUrl;
    }
  }

  protected onRealmChanged = () => {
    this.setState({ adminRealmChanges: this.state.adminRealmChanges + 1 });
  };

  protected onRealmLoaded = () => {
    // The child components will be updated from the change of progress state
  };

  protected onSyncError = async (
    session: Realm.Sync.Session,
    error: Realm.Sync.SyncError,
  ) => {
    if (error.message === 'SSL server certificate rejected') {
      this.certificateWasRejected = true;
      this.setState({
        progress: {
          status: 'failed',
          message: 'The servers certificate could not be trusted',
          retry: {
            label: 'Reconnect, trusting the certificate',
            onRetry: () => {
              this.onValidateCertificatesChange(false);
            },
          },
        },
      });
    } else if (error.isFatal) {
      this.setState({
        progress: {
          status: 'failed',
          message: error.message,
          retry: {
            label: 'Reconnect',
            onRetry: this.onReconnect,
          },
        },
      });
    }
  };

  protected cloudStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: ICloudStatus,
  ) => {
    // If the user is deauthenticated - close the window if it's administering a cloud tenant
    if (this.props.isCloudTenant && status.kind === 'not-authenticated') {
      electron.remote.getCurrentWindow().close();
    }
  };

  protected onDowngradeStudio = () => {
    const url = this.downgradedStudioUrl();
    electron.remote.shell.openExternal(url);
    window.close();
  };

  protected onValidateCertificatesChange = (validateCertificates: boolean) => {
    const url = new URL(location.href);
    const props = { ...this.props };
    props.validateCertificates = validateCertificates;
    url.searchParams.set('props', JSON.stringify(props));
    location.replace(url.toString());
  };
}

export { ServerAdministrationContainer as ServerAdministration };
