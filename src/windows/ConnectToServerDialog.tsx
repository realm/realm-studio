import * as React from 'react';

import { ConnectToServerContainer } from '../ui/connect-to-server/ConnectToServerContainer';
import { Window } from './Window';
import { IConnectToServerOptions } from './WindowType';

export class ConnectToServerDialog extends Window<
  {
    options: IConnectToServerOptions;
  },
  {}
> {
  public render() {
    return <ConnectToServerContainer url={this.props.options.url} />;
  }
}
