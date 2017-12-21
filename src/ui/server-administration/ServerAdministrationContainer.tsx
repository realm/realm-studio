import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../actions/main';
import { ICloudStatus } from '../../main/CloudManager';
import {
  IAdminTokenCredentials,
  IRealmFile,
  IUser,
  IUsernamePasswordCredentials,
  realms,
  users,
} from '../../services/ros';
import {
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
} from '../../windows/WindowType';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/realm-loading-component';

import { ValidateCertificatesChangeHandler } from './realms/RealmsTableContainer';
import { ServerAdministration, Tab } from './ServerAdministration';

export interface IServerAdministrationContainerProps
  extends IServerAdministrationWindowProps {
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
}

export interface IServerAdministrationContainerState
  extends IRealmLoadingComponentState {
  activeTab: Tab;
  isRealmOpening: boolean;
  syncError?: Realm.Sync.SyncError;
  user: Realm.Sync.User | null;
}

export class ServerAdministrationContainer extends RealmLoadingComponent<
  IServerAdministrationContainerProps,
  IServerAdministrationContainerState
> {
  constructor() {
    super();
    this.state = {
      activeTab: null,
      isRealmOpening: false,
      progress: { status: 'idle' },
      user: null,
    };
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

  public async componentDidMount() {
    // Start listening on changes to the cloud-status
    electron.ipcRenderer.on('cloud-status', this.onCloudStatusChanged);
    try {
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
        activeTab: Tab.Dashboard,
      });
    } else {
      this.setState({
        activeTab: Tab.Realms,
      });
    }
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'cloud-status',
      this.onCloudStatusChanged,
    );
  }

  public render() {
    return (
      <ServerAdministration
        {...this.state}
        {...this}
        adminRealm={this.realm}
        adminRealmProgress={this.state.progress}
        isCloudTenant={this.props.isCloudTenant || false}
        onValidateCertificatesChange={this.props.onValidateCertificatesChange}
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
      await main.showRealmBrowser({
        type: 'realm-browser',
        realm,
      });
      this.setState({ isRealmOpening: false });
    }
  };

  public onReconnect = () => {
    // TODO: Use reopen the Realm instead of reloading
    /*
    this.setState({ syncError: undefined });
    this.authenticate();
    */
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
      showError('Failed to open the __admin Realm', err);
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
    this.forceUpdate();
  };

  protected onRealmLoaded = () => {
    // The child components will be updated from the change of progress state
  };

  protected onSyncError = (
    session: Realm.Sync.Session,
    error: Realm.Sync.SyncError,
  ) => {
    if (error.message === 'SSL server certificate rejected') {
      this.certificateWasRejected = true;
    } else {
      this.setState({
        syncError: error,
      });
    }
  };

  protected onCloudStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: ICloudStatus,
  ) => {
    // If the user is deauthenticated - close the window if it's administering a cloud tenant
    if (this.props.isCloudTenant && status.kind === 'not-authenticated') {
      electron.remote.getCurrentWindow().close();
    }
  };
}
