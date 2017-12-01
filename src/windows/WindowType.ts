// These enums and interfaces are not in index.tsx to enable the main process to import this without importing
// React components.
import { URL } from 'url';

import * as ros from '../services/ros';
import * as tutorials from '../services/tutorials';

export enum WindowType {
  CloudAdministration = 'cloud-administration',
  ConnectToServer = 'connect-to-server',
  Greeting = 'greeting',
  RealmBrowser = 'realm-browser',
  ServerAdministration = 'server-administration',
  Tutorial = 'tutorial',
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

export interface ITutorialOptions {
  id: string;
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
    const options: IRealmBrowserOptions = context;
    const title =
      options.realm.mode === 'synced'
        ? getRealmUrl(options.realm)
        : options.realm.path;
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
    const options: IServerAdministrationOptions = context;
    const credentials = options.credentials;
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
  } else if (type === WindowType.CloudAdministration) {
    return {
      title: `Realm Cloud`,
      width: 1024,
      height: 500,
    };
  } else if (type === WindowType.Tutorial) {
    const options = context as ITutorialOptions;
    const config = tutorials.getConfig(options.id);
    const title = config ? config.title : 'Missing a title';
    return {
      title: `Tutorial: ${title}`,
      width: 800,
      height: 500,
    };
  }
  return {};
}
