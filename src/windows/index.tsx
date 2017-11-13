import * as querystring from 'querystring';
import * as React from 'react';

import {
  IConnectToServerOptions,
  IRealmBrowserOptions,
  IServerAdministrationOptions,
  WindowType,
} from './WindowType';

export function getWindow(type: WindowType): React.ReactElement<{}> {
  // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = querystring.parse<{ options: string }>(queryString);
  const options = query.options ? JSON.parse(query.options) as object : {};

  // We're using calls to require here, to prevent loading anything that does not
  // relate to the specific window being loaded.
  if (type === WindowType.RealmBrowser) {
    const RealmBrowserWindow = require('./RealmBrowserWindow')
      .RealmBrowserWindow;
    return <RealmBrowserWindow options={options as IRealmBrowserOptions} />;
  } else if (type === WindowType.ConnectToServer) {
    const ConnectToServerDialog = require('./ConnectToServerDialog')
      .ConnectToServerDialog;
    return (
      <ConnectToServerDialog options={options as IConnectToServerOptions} />
    );
  } else if (type === WindowType.ServerAdministration) {
    const ServerAdministrationWindow = require('./ServerAdministrationWindow')
      .ServerAdministrationWindow;
    return (
      <ServerAdministrationWindow
        options={options as IServerAdministrationOptions}
      />
    );
  } else if (type === WindowType.Greeting) {
    const GreetingWindow = require('./GreetingWindow').GreetingWindow;
    return <GreetingWindow />;
  } else if (type === WindowType.CloudAdministration) {
    const CloudAdministrationWindow = require('./CloudAdministrationWindow')
      .CloudAdministrationWindow;
    return <CloudAdministrationWindow />;
  } else {
    throw new Error(`Unexpected window type: ${type}`);
  }
}

export function CurrentWindow(): React.ReactElement<{}> {
  // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = querystring.parse<{ windowType: WindowType }>(queryString);
  return getWindow(query.windowType);
}
