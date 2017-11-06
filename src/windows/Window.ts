import * as React from 'react';
import * as mixpanel from '../mixpanel';

import { ServerAdministrationContainer } from '../ui/server-administration/ServerAdministrationContainer';
import { IServerAdministrationOptions } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export abstract class Window<P, S> extends React.Component<P, S> {
  public componentDidMount() {
    const trackedProperties = this.getTrackedProperties();
    mixpanel.track('Window opened', {
      ...trackedProperties,
      type: this.constructor.name,
    });
  }

  protected getTrackedProperties(): { [n: string]: any } {
    return {};
  }
}
