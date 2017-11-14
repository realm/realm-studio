// These enums and interfaces are not in index.tsx to enable the main process to import this without importing
// React components.

import * as ros from '../services/ros';

export enum WindowType {
  CloudAdministration = 'cloud-administration',
  ConnectToServer = 'connect-to-server',
  Greeting = 'greeting',
  RealmBrowser = 'realm-browser',
  ServerAdministration = 'server-administration',
}

export interface IServerAdministrationOptions {
  credentials: ros.IServerCredentials;
  validateCertificates: boolean;
  isCloudTenant?: boolean;
}

export interface IConnectToServerOptions {
  url?: string;
}

export interface IRealmBrowserOptions {
  realm: ros.realms.ISyncedRealmToLoad | ros.realms.ILocalRealmToLoad;
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
  } else if (type === WindowType.CloudAdministration) {
    return {
      title: `Realm Cloud`,
      width: 1024,
      height: 500,
    };
  }
  return {};
}
