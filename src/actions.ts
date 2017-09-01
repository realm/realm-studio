import { ipcRenderer } from "electron";
import * as Realm from "realm";

export enum Actions {
  OpenServerAdministration = "open-server-administration",
}

// TODO: Change this once the realm-js Realm.Sync.User serializes correctly
// @see https://github.com/realm/realm-js/issues/1276
export interface IShowServerAdministrationOptions {
  url: string;
  username: string;
  password: string;
}

export const showServerAdministration = (options: IShowServerAdministrationOptions) => {
  // We use sendSync to avoid closing windows before it completes
  ipcRenderer.sendSync(Actions.OpenServerAdministration, options);
};
