import * as React from 'react';

import { RealmBrowserContainer } from '../ui/realm-browser/RealmBrowserContainer';
import { Window } from './Window';
import { IRealmBrowserOptions } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class RealmBrowserWindow extends Window<
  {
    options: IRealmBrowserOptions;
  },
  {}
> {
  public render() {
    return (
      <RealmBrowserContainer
        addMenuGenerator={this.addMenuGenerator}
        removeMenuGenerator={this.removeMenuGenerator}
        {...this.props.options}
      />
    );
  }

  public getTrackedProperties() {
    return {
      mode: this.props.options.realm.mode,
    };
  }
}
