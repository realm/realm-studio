import * as electron from 'electron';
import * as React from 'react';

import { IUpdateStatus } from '../../main/updater';

import { main } from '../../actions/main';

import { Greeting } from './Greeting';

export class GreetingContainer extends React.Component<
  {},
  {
    updateStatus: IUpdateStatus;
    isSyncEnabled: boolean;
    version: string;
  }
> {
  constructor() {
    super();
    this.state = {
      updateStatus: {
        checking: false,
      },
      isSyncEnabled: false,
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

  public onOpenLocalRealm = () => {
    main.showOpenLocalRealm();
  };

  public updateStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: IUpdateStatus,
  ) => {
    this.setState({ updateStatus: status });
  };
}
