import * as React from 'react';

import { RealmBrowserContainer } from '../ui/realm-browser/RealmBrowserContainer';
import { Window } from './Window';
import { IRealmBrowserWindowProps } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class RealmBrowserWindow extends Window<IRealmBrowserWindowProps, {}> {
  public render() {
    return (
      <RealmBrowserContainer
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
