import * as electron from 'electron';
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
import {
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
} from '../../windows/WindowType';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/RealmLoadingComponent';

import { ValidateCertificatesChangeHandler } from './RealmsTable';
import { ServerAdministration, Tab } from './ServerAdministration';

export interface IServerAdministrationContainerProps
  extends IServerAdministrationWindowProps {
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
  isCloudTenant?: boolean;
}

export interface IServerAdministrationContainerState
  extends IRealmLoadingComponentState {
  activeTab: Tab | null;
  // This will increment when the realm changes to trigger updates to the UI.
  adminRealmChanges: number;
  isRealmOpening: boolean;
  user: Realm.Sync.User | null;
}

class ServerAdministrationContainer extends RealmLoadingComponent<
  IServerAdministrationContainerProps,
  IServerAdministrationContainerState
> {
  protected availabilityPromise?: Promise<void>;

  constructor() {
    super();
    this.state = {
      activeTab: null,
      adminRealmChanges: 0,
      isRealmOpening: false,
      progress: { status: 'idle' },
      user: null,
    };
  }

  public async componentDidMount() {
    // Start listening on changes to the cloud-status
    electron.ipcRenderer.on('cloud-status', this.cloudStatusChanged);
    try {
      await this.ensureServerIsAvailable(this.props.credentials.url);
      // Authenticate towards the server
      const user = await users.authenticate(this.props.credentials);
      this.setState({
        user,
      });
    } catch (err) {
      showError('Failed when authenticating with the Realm Object Server', err);
    }

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

  public async componentWillMount() {
    this.authenticate();
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
    return this.realm ? (
      <ServerAdministration
        {...this.state}
        {...this}
        adminRealm={this.realm}
        adminRealmChanges={this.state.adminRealmChanges}
        adminRealmProgress={this.state.progress}
        isCloudTenant={this.props.isCloudTenant || false}
        onValidateCertificatesChange={this.props.onValidateCertificatesChange}
        validateCertificates={this.props.validateCertificates}
      />
    ) : null;
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
      await main.showRealmBrowser({
        type: 'realm-browser',
        realm,
      });
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
      this.setState({
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

  protected async ensureServerIsAvailable(url: string) {
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
            const available = await isAvailable(url);
            if (available) {
              // Let's resolve the promise, delete it and break the endless loop
              resolve();
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
      this.props.onValidateCertificatesChange(realm.validateCertificates);
    } else {
      return super.loadRealm(realm);
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
              this.props.onValidateCertificatesChange(false);
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
}

export { ServerAdministrationContainer as ServerAdministration };
