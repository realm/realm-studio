import * as electron from 'electron';
import * as React from 'react';

import { IUpdateStatus } from '../../main/Updater';

import { main } from '../../actions/main';
import * as github from '../../services/github';
import * as raas from '../../services/raas';

import { Greeting } from './Greeting';

export class GreetingContainer extends React.Component<
  {},
  {
    isSyncEnabled: boolean;
    updateStatus: IUpdateStatus;
    version: string;
  }
> {
  constructor() {
    super();
    this.state = {
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

  public onConnectToServer = () => {
    main.showConnectToServer();
  };

  public onShowCloudAdministration = async () => {
    // main.showCloudAdministration();
    // Authenticate with GitHub
    const code = await github.authenticate();
    const response = await raas.authenticate(code);
    // Now that we're authenticated - let's create a tenant
    // Poll the tenant for it's availability
    // this.setState();
    // Connect to the tenant
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
}
