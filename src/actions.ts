import { ipcRenderer } from 'electron';
import * as Realm from 'realm';

import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
} from './windows/WindowType';

export enum Actions {
  ShowConnectToServer = 'show-connect-to-server',
  ShowGreeting = 'show-server-administration',
  ShowOpenLocalRealm = 'show-open-local-realm',
  ShowRealmBrowser = 'show-realm-browser',
  ShowServerAdministration = 'show-server-administration',
}

// We use sendSync to avoid closing windows before the actions complete

export const showConnectToServer = (options?: void) => {
  ipcRenderer.sendSync(Actions.ShowConnectToServer, options);
};

export const showGreeting = (options?: void) => {
  ipcRenderer.sendSync(Actions.ShowGreeting);
};

export const showOpenLocalRealm = (options?: void) => {
  ipcRenderer.sendSync(Actions.ShowOpenLocalRealm, options);
};

export const showRealmBrowser = async (options: IRealmBrowserOptions) => {
  return new Promise((resolve, reject) => {
    const success = ipcRenderer.sendSync(Actions.ShowRealmBrowser, options);
    if (success) {
      resolve();
    } else {
      reject();
    }
  });
};

export const showServerAdministration = (
  options: IServerAdministrationOptions,
) => {
  ipcRenderer.sendSync(Actions.ShowServerAdministration, options);
};
