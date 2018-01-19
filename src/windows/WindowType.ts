// These enums and interfaces are not in index.tsx to enable the main process to import this without importing
// React components.
import * as assert from 'assert';
import { URL } from 'url';

import * as ros from '../services/ros';
import * as tutorials from '../services/tutorials';

export type WindowType =
  | 'cloud-authentication'
  | 'connect-to-server'
  | 'greeting'
  | 'realm-browser'
  | 'server-administration'
  | 'tutorial';

export interface IWindowProps {
  type: WindowType;
}

export interface ICloudAuthenticationWindowProps extends IWindowProps {
  type: 'cloud-authentication';
}

export interface IConnectToServerWindowProps extends IWindowProps {
  type: 'connect-to-server';
  url?: string;
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
  isCloudTenant?: boolean;
  validateCertificates: boolean;
}

export interface ITutorialWindowProps extends IWindowProps {
  type: 'tutorial';
  id: string;
  context: {
    serverUrl: string;
  };
}

export type WindowProps =
  | ICloudAuthenticationWindowProps
  | IConnectToServerWindowProps
  | IGreetingWindowProps
  | IRealmBrowserWindowProps
  | IServerAdministrationWindowProps
  | ITutorialWindowProps;

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
  } else if (props.type === 'cloud-authentication') {
    return {
      title: `Realm Cloud`,
      width: 400,
      height: 420,
    };
  } else if (props.type === 'tutorial') {
    const config = tutorials.getConfig(props.id);
    const title = config ? config.title : 'Missing a title';
    return {
      title: `Tutorial: ${title}`,
      width: 800,
      height: 500,
    };
  }
  return {};
}
