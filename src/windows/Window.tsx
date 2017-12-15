// Ensure that the window / UI code is not bundled into the main bundle.
if (process.type === 'browser') {
  throw new Error('This module should not be imported from the main process');
}

import { remote } from 'electron';
import * as querystring from 'querystring';
import * as React from 'react';
import * as mixpanel from '../mixpanel';

import { ServerAdministrationContainer } from '../ui/server-administration/ServerAdministrationContainer';
import {
  generateMenu,
  IMenuGenerator,
  IMenuGeneratorProps,
} from './MenuGenerator';
import { WindowProps, WindowType } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

interface ITrackedProperties {
  type: WindowType;
  [name: string]: string;
}

export abstract class Window<P extends WindowProps, S> extends React.Component<
  P,
  S
> implements IMenuGeneratorProps {
  protected menuGenerators: IMenuGenerator[] = [];

  public componentDidMount() {
    const trackedProperties = this.getTrackedProperties();
    mixpanel.track('Window opened', trackedProperties);
    // Generate the menu now and whenever the window gets focus
    this.generateMenu();
    window.addEventListener('focus', this.generateMenu);
  }

  public componentWillUnmount() {
    window.removeEventListener('focus', this.generateMenu);
  }

  public addMenuGenerator = (generator: IMenuGenerator) => {
    if (this.menuGenerators.indexOf(generator) === -1) {
      // Add the menu generator to the array
      this.menuGenerators.push(generator);
    }
  };

  public removeMenuGenerator = (generator: IMenuGenerator) => {
    const index = this.menuGenerators.indexOf(generator);
    if (index >= 0) {
      // Remove this menu generator from the array
      this.menuGenerators.splice(index, 1);
    }
  };

  public generateMenu = () => {
    // Let's only generate menus of windows that are focused
    if (remote.getCurrentWindow().isFocused()) {
      // Generate and set the application
      const menu = generateMenu(this.menuGenerators);
      remote.Menu.setApplicationMenu(menu);
    }
  };

  protected getTrackedProperties(): ITrackedProperties {
    return {
      type: this.props.type,
    };
  }
}

function getWindowClass(props: WindowProps): React.ComponentClass {
  // We're using calls to require here, to prevent loading anything that does not
  // relate to the specific window being loaded.
  if (props.type === 'realm-browser') {
    return require('./RealmBrowserWindow').RealmBrowserWindow;
  } else if (props.type === 'connect-to-server') {
    return require('./ConnectToServerDialog').ConnectToServerDialog;
  } else if (props.type === 'server-administration') {
    return require('./ServerAdministrationWindow').ServerAdministrationWindow;
  } else if (props.type === 'greeting') {
    return require('./GreetingWindow').GreetingWindow;
  } else {
    throw new Error(`Unexpected window type: ${(props as any).type}`);
  }
}

export function getWindow(): React.ReactElement<{}> {
  // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = querystring.parse<{ props: string }>(queryString);
  if (query && typeof query.props === 'string') {
    const props: WindowProps = JSON.parse(query.props);
    const CurrentWindow: React.ComponentClass = getWindowClass(props);
    return <CurrentWindow {...props} />;
  } else {
    throw new Error('Expected "props" in the query parameters');
  }
}
