import * as electron from 'electron';
import * as React from 'react';

import { IUpdateStatus } from '../../main/Updater';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';
import { IServerCredentials } from '../../services/ros';

import { Greeting } from './Greeting';

interface IGreetingContainerState {
  defaultCloudCrendentials?: IServerCredentials;
  hasAuthenticated: boolean;
  isCloudOverlayVisible: boolean;
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
      hasAuthenticated: false,
      isCloudOverlayVisible: false,
      isSyncEnabled: false,
      updateStatus: {
        state: 'up-to-date',
      },
      version: electron.remote.app.getVersion() || 'unknown',
    };
  }

  public componentDidMount() {
    electron.ipcRenderer.on('update-status', this.updateStatusChanged);
    // Require realm and check update state with the sync support
    // Using nextTick to prevent blocking when loading realm
    process.nextTick(() => {
      const Realm = require('realm');
      this.setState({
        isSyncEnabled: !!Realm.Sync,
      });
    });
    this.updateCloudCredentials();
    this.updateHasAuthenticated();
  }

  public componentWillUnmount() {
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
    const code = await main.authenticateWithGitHub();
    const response = await raas.authenticate(code);
    if (response.token) {
      this.setState({
        hasAuthenticated: true,
        // Show the cloud overlay if the user has no default credentials
        isCloudOverlayVisible: !this.state.defaultCloudCrendentials,
      });
    }
  };

  public onAuthenticated = () => {
    this.setState({ isCloudOverlayVisible: false });
    this.updateHasAuthenticated();
    this.updateCloudCredentials();
  };

  public onConnectToDefaultRealmCloud = () => {
    if (this.state.defaultCloudCrendentials) {
      main.showServerAdministration({
        credentials: this.state.defaultCloudCrendentials,
        validateCertificates: true,
      });
    } else {
      throw new Error(`Missing credentials`);
    }
  };

  public onConnectToServer = () => {
    main.showConnectToServer();
  };

  public onShowCloudAdministration = () => {
    this.setState({ isCloudOverlayVisible: true });
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

  protected updateCloudCredentials() {
    const credentials = localStorage.getItem(raas.DEFAULT_CREDENTIALS_KEY);
    if (credentials) {
      this.setState({
        defaultCloudCrendentials: JSON.parse(credentials),
      });
    } else {
      this.setState({
        defaultCloudCrendentials: undefined,
      });
    }
  }

  protected updateHasAuthenticated() {
    this.setState({
      hasAuthenticated: raas.hasToken(),
    });
  }
}
