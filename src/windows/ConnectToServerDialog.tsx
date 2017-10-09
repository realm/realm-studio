import * as React from 'react';

import { ConnectToServerContainer } from '../ui/connect-to-server/ConnectToServerContainer';
import { Window } from './Window';

export class ConnectToServerDialog extends Window<{}, {}> {
  public render() {
    return <ConnectToServerContainer />;
  }
}
