import * as React from 'react';

import { ServerAdministrationContainer } from '../ui/server-administration/ServerAdministrationContainer';
import { IServerAdministrationOptions } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class ServerAdministrationWindow extends React.Component<
  {
    options: IServerAdministrationOptions;
  },
  {}
> {
  public render() {
    return <ServerAdministrationContainer {...this.props.options} />;
  }
}
