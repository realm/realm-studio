// These enums and interfaces are not in index.tsx to enable the main process to import this without importing
// React components.
import { URL } from 'url';

import * as ros from '../services/ros';

export enum WindowType {
  ConnectToServer = 'connect-to-server',
  Greeting = 'greeting',
  RealmBrowser = 'realm-browser',
  ServerAdministration = 'server-administration',
}

export interface IServerAdministrationOptions {
  credentials: ros.IServerCredentials;
  validateCertificates: boolean;
}

export interface IRealmBrowserOptions {
  realm: ros.realms.ISyncedRealmToLoad | ros.realms.ILocalRealmToLoad;
}

const getRealmUrl = (realm: ros.realms.ISyncedRealmToLoad) => {
  const url = new URL(
    realm.authentication instanceof Realm.Sync.User
      ? realm.authentication.server
      : realm.authentication.url,
  );
  url.pathname = realm.path;
  return url.toString();
};

export function getWindowOptions(
  type: WindowType,
  context: any,
): Partial<Electron.BrowserWindowConstructorOptions> {
  if (type === WindowType.RealmBrowser) {
    const browserOptions: IRealmBrowserOptions = context;
    const title =
      browserOptions.realm.mode === 'synced'
        ? getRealmUrl(browserOptions.realm)
        : browserOptions.realm.path;
    return {
      title,
    };
  } else if (type === WindowType.ConnectToServer) {
    return {
      title: 'Connect to Realm Object Server',
      width: 500,
      height: 300,
      resizable: false,
    };
  } else if (type === WindowType.ServerAdministration) {
    const credentials = context.credentials;
    const url = credentials ? credentials.url : 'http://...';
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
