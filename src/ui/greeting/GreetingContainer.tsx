import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { IUpdateStatus } from '../../main/updater';

import { showConnectToServer, showOpenLocalRealm } from '../../actions';

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
      isSyncEnabled: !!Realm.Sync,
      version: electron.remote.app.getVersion() || 'unknown',
    };
  }

  public componentDidMount() {
    electron.ipcRenderer.on('update-status', this.updateStatusChanged);
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
    showConnectToServer();
  };

  public onOpenLocalRealm = () => {
    showOpenLocalRealm();
  };

  public updateStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: IUpdateStatus,
  ) => {
    this.setState({ updateStatus: status });
  };
}
