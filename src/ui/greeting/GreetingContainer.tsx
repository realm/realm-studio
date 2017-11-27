import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../actions/main';
import { ICloudStatus } from '../../main/CloudManager';
import { IUpdateStatus } from '../../main/Updater';
import { IServerCredentials } from '../../services/ros';
import { store } from '../../store';

import { Greeting } from './Greeting';

interface IGreetingContainerState {
  cloudStatus?: ICloudStatus;
  isCloudOverlayActivated: boolean;
  isSyncEnabled: boolean;
  updateStatus: IUpdateStatus;
  version: string;
}

export class GreetingContainer extends React.Component<
  {},
  IGreetingContainerState
> {
  constructor() {
    super();
    this.state = {
      isCloudOverlayActivated: false,
      isSyncEnabled: false,
      updateStatus: {
        state: 'up-to-date',
      },
      version: electron.remote.app.getVersion() || 'unknown',
    };
  }

  public componentDidMount() {
    electron.ipcRenderer.on('cloud-status', this.cloudStatusChanged);
    electron.ipcRenderer.on('update-status', this.updateStatusChanged);
    // Require realm and check update state with the sync support
    // Using nextTick to prevent blocking when loading realm
    process.nextTick(() => {
      const Realm = require('realm');
      this.setState({
        isSyncEnabled: !!Realm.Sync,
      });
    });
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'cloud-status',
      this.cloudStatusChanged,
    );
    electron.ipcRenderer.removeListener(
      'update-status',
      this.updateStatusChanged,
    );
  }

  public render() {
    return <Greeting {...this.state} {...this} />;
  }

  public onAuthenticate = async () => {
    // Authenticate with GitHub
    await main.authenticateWithGitHub();
  };

  public onAuthenticated = async () => {
    await main.refreshCloudStatus();
  };

  public onConnectToPrimarySubscription = () => {
    if (this.state.cloudStatus && this.state.cloudStatus.primarySubscription) {
      const credentials = this.state.cloudStatus.primarySubscriptionCrednetials;
      if (credentials) {
        main.showServerAdministration({
          credentials,
          validateCertificates: true,
          isCloudTenant: true,
        });
      } else {
        throw new Error(`Missing a primary subscription credentials`);
      }
    } else {
      throw new Error(`Missing a primary subscription`);
    }
  };

  public onConnectToServer = () => {
    main.showConnectToServer();
  };

  public onOpenLocalRealm = () => {
    main.showOpenLocalRealm();
  };

  public onCheckForUpdates = () => {
    main.checkForUpdates();
  };

  public updateStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: IUpdateStatus,
  ) => {
    this.setState({ updateStatus: status });
  };

  public cloudStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: ICloudStatus,
  ) => {
    const isCloudOverlayActivated =
      !!status.raasToken && !status.primarySubscription;
    if (isCloudOverlayActivated) {
      // Focus the window
      electron.remote.getCurrentWindow().focus();
    }
    this.setState({
      cloudStatus: status,
      // Show the cloud overlay if the user has no default credentials
      isCloudOverlayActivated,
    });
  };
}
