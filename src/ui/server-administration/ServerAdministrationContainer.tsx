import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../actions/main';
import { ICloudStatus } from '../../main/CloudManager';
import {
  IAdminTokenCredentials,
  IUsernamePasswordCredentials,
  realms,
  users,
} from '../../services/ros';
import {
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
} from '../../windows/WindowType';
import { showError } from '../reusable/errors';

import { ValidateCertificatesChangeHandler } from './realms/RealmsTableContainer';
import { ServerAdministration, Tab } from './ServerAdministration';

export interface IServerAdministrationContainerProps
  extends IServerAdministrationWindowProps {
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
}

export interface IServerAdministrationContainerState {
  activeTab: Tab | null;
  isRealmOpening: boolean;
  user: Realm.Sync.User | null;
}

export class ServerAdministrationContainer extends React.Component<
  IServerAdministrationContainerProps,
  IServerAdministrationContainerState
> {
  constructor() {
    super();
    this.state = {
      activeTab: null,
      isRealmOpening: false,
      user: null,
    };
  }

  public async componentDidMount() {
    // Start listening on changes to the cloud-status
    electron.ipcRenderer.on('cloud-status', this.cloudStatusChanged);
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
      this.cloudStatusChanged,
    );
  }

  public render() {
    return (
      <ServerAdministration
        {...this.state}
        {...this}
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

  public onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
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
