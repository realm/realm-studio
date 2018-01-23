// These enums and interfaces are not in index.tsx to enable the main process to import this without importing
// React components.
import * as assert from 'assert';
import { URL } from 'url';

import * as ros from '../services/ros';

export type WindowType =
  | 'connect-to-server'
  | 'greeting'
  | 'realm-browser'
  | 'server-administration';

export interface IWindowProps {
  type: WindowType;
}

export interface IConnectToServerWindowProps extends IWindowProps {
  type: 'connect-to-server';
}

export interface IGreetingWindowProps extends IWindowProps {
  type: 'greeting';
}

export interface IRealmBrowserWindowProps extends IWindowProps {
  type: 'realm-browser';
  realm: ros.realms.ISyncedRealmToLoad | ros.realms.ILocalRealmToLoad;
}

export interface IServerAdministrationWindowProps extends IWindowProps {
  type: 'server-administration';
  credentials: ros.IServerCredentials;
  validateCertificates: boolean;
}

export type WindowProps =
  | IConnectToServerWindowProps
  | IGreetingWindowProps
  | IRealmBrowserWindowProps
  | IServerAdministrationWindowProps;

const getRealmUrl = (realm: ros.realms.ISyncedRealmToLoad) => {
  const url = new URL(
    realm.authentication instanceof Realm.Sync.User
      ? realm.authentication.server
      : realm.authentication.url,
  );
  url.pathname = realm.path;
  return url.toString();
};

/*
 * Generate options that should get passed to the BrowserWindow constructor,
 * when opening a particular window type.
 */
export function getWindowOptions(
  props: WindowProps,
): Partial<Electron.BrowserWindowConstructorOptions> {
  if (props.type === 'realm-browser') {
    const title =
      props.realm.mode === 'synced'
        ? getRealmUrl(props.realm)
        : props.realm.path;
    return {
      title,
    };
  } else if (props.type === 'connect-to-server') {
    return {
      title: 'Connect to Realm Object Server',
      width: 500,
      height: 300,
      resizable: false,
    };
  } else if (props.type === 'server-administration') {
    const credentials = props.credentials;
    const url = credentials ? credentials.url : 'http://...';
    return {
      title: `Realm Object Server: ${url}`,
      width: 1024,
      height: 600,
    };
  } else if (props.type === 'greeting') {
    return {
      title: `Realm Studio`,
      width: 600,
      height: 400,
      resizable: false,
    };
  }
  return {};
}
