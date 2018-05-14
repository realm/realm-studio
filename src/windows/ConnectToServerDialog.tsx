import * as React from 'react';

import { ConnectToServer } from '../ui/ConnectToServer';
import { Window } from './Window';
import { IConnectToServerWindowProps } from './WindowType';

export class ConnectToServerDialog extends Window<
  IConnectToServerWindowProps,
  {}
> {
  public render() {
    return <ConnectToServer url={this.props.url} />;
  }
}
