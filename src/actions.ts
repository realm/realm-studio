import { ipcRenderer } from "electron";
import * as Realm from "realm";

import { IServerAdministrationOptions } from "./windows/WindowType";

export enum Actions {
  OpenServerAdministration = "open-server-administration",
}

export const showServerAdministration = (options: IServerAdministrationOptions) => {
  // We use sendSync to avoid closing windows before it completes
  ipcRenderer.sendSync(Actions.OpenServerAdministration, options);
};
