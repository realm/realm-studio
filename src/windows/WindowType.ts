// These enums and interfaces are not in index.tsx to enable the main process to import this without importing
// React components.

import { IRealmToLoad, IServerCredentials } from '../services/ros';

export enum WindowType {
  ConnectToServer = 'connect-to-server',
  Greeting = 'greeting',
  RealmBrowser = 'realm-browser',
  ServerAdministration = 'server-administration',
}

export interface IServerAdministrationOptions {
  credentials: IServerCredentials;
}

export interface IRealmBrowserOptions {
  realm: IRealmToLoad;
}

export function getWindowOptions(
  type: WindowType,
  context: any,
): Partial<Electron.BrowserWindowConstructorOptions> {
  if (type === WindowType.RealmBrowser) {
    return {
      title: typeof context.path === 'string' ? context.path : 'Realm Browser',
    };
  } else if (type === WindowType.ConnectToServer) {
    return {
      title: 'Connect to Realm Object Server',
      width: 500,
      height: 300,
      resizable: false,
    };
  } else if (type === WindowType.ServerAdministration) {
    const url = typeof context.url === 'string' ? context.url : 'http://...';
    return {
      title: `Realm Object Server: ${url}`,
      width: 1024,
      height: 600,
    };
  } else if (type === WindowType.Greeting) {
    return {
      title: `Realm Studio`,
      width: 600,
      height: 400,
      resizable: false,
    };
  }
  return {};
}
