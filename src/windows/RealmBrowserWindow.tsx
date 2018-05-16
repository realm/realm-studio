import * as React from 'react';

import { RealmBrowser } from '../ui/RealmBrowser';
import { Window } from './Window';
import { IRealmBrowserWindowProps } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class RealmBrowserWindow extends Window<IRealmBrowserWindowProps, {}> {
  public render() {
    return (
      <RealmBrowser
        {...this.props}
        addMenuGenerator={this.addMenuGenerator}
        removeMenuGenerator={this.removeMenuGenerator}
        updateMenu={this.updateMenu}
      />
    );
  }

  protected getTrackedProperties() {
    return {
      ...super.getTrackedProperties(),
      mode: this.props.realm.mode,
    };
  }
}
