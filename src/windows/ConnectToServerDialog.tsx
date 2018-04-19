import * as React from 'react';

import { ConnectToServerContainer } from '../ui/ConnectToServer/ConnectToServerContainer';
import { Window } from './Window';
import { IConnectToServerWindowProps } from './WindowType';

export class ConnectToServerDialog extends Window<
  IConnectToServerWindowProps,
  {}
> {
  public render() {
    return <ConnectToServerContainer url={this.props.url} />;
  }
}
