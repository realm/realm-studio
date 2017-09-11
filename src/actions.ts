import { ipcRenderer } from "electron";
import * as Realm from "realm";

import { IServerAdministrationOptions } from "./windows/WindowType";

export enum Actions {
  ShowGreeting = "show-server-administration",
  ShowServerAdministration = "show-server-administration",
}

export const showGreeting = (options?: void) => {
  ipcRenderer.sendSync(Actions.ShowGreeting);
};

export const showServerAdministration = (options: IServerAdministrationOptions) => {
  // We use sendSync to avoid closing windows before it completes
  ipcRenderer.sendSync(Actions.ShowServerAdministration, options);
};
