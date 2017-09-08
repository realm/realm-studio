import * as electron from "electron";
import * as Realm from "realm";

import { Actions } from "../actions";
import { IServerAdministrationOptions, WindowType } from "../windows/WindowType";
import MainMenu from "./main-menu";
import WindowManager from "./window-manager";

export default class Application {
  public static sharedApplication = new Application();

  private mainMenu = new MainMenu();
  private windowManager = new WindowManager();

  public run() {
    this.addAppListeners();
    this.addIpcListeners();
    // If its already ready - the handler won't be called
    if (electron.app.isReady()) {
      this.onReady();
    }
  }

  public destroy() {
    this.removeAppListeners();
    this.removeIpcListeners();
    this.windowManager.closeAllWindows();
  }

  public userDataPath(): string {
    return electron.app.getPath("userData");
  }

  public openFile(path: string) {
    const window = this.windowManager.createWindow(WindowType.RealmBrowser, { path });
    window.once("ready-to-show", () => {
      window.show();
      window.webContents.send("open-file", { path });
    });
  }

  public showOpenDialog() {
    electron.dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Realm Files", extensions: ["realm"] }],
    }, (selectedPaths) => {
      if (selectedPaths) {
        this.openFile(selectedPaths[0]);
      }
    });
  }

  public showConnectToServerDialog() {
    const window = this.windowManager.createWindow(WindowType.ConnectToServer);
    window.once("ready-to-show", () => {
      window.show();
    });
  }

  public showServerAdministration(options: IServerAdministrationOptions) {
    // TODO: Change this once the realm-js Realm.Sync.User serializes correctly
    // @see https://github.com/realm/realm-js/issues/1276
    const window = this.windowManager.createWindow(WindowType.ServerAdministration, options);
    window.once("ready-to-show", () => {
      window.show();
    });
  }

  private addAppListeners() {
    electron.app.addListener("ready", this.onReady);
    electron.app.addListener("activate", this.onActivate);
    electron.app.addListener("open-file", this.onOpenFile);
    electron.app.addListener("window-all-closed", this.onWindowAllClosed);
  }

  private removeAppListeners() {
    electron.app.removeListener("ready", this.onReady);
    electron.app.removeListener("activate", this.onActivate);
    electron.app.removeListener("open-file", this.onOpenFile);
    electron.app.removeListener("window-all-closed", this.onWindowAllClosed);
  }

  private addIpcListeners() {
    electron.ipcMain.addListener(Actions.OpenServerAdministration, this.onShowServerAdministration);
  }

  private removeIpcListeners() {
    electron.ipcMain.removeListener(Actions.OpenServerAdministration, this.onShowServerAdministration);
  }

  private onReady = () => {
    this.mainMenu.set();
    // this.showOpenDialog();
    this.showConnectToServerDialog();

    electron.app.focus();
  }

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      this.showConnectToServerDialog();
    }
  }

  private onOpenFile = (event: any, path: string) => {
    this.openFile(path);
  }

  private onWindowAllClosed = () => {
    if (process.platform !== "darwin") {
      electron.app.quit();
    }
  }

  private onShowServerAdministration = (event: any, ...args: any[]) => {
    this.showServerAdministration(args[0] as IServerAdministrationOptions);
    event.returnValue = true;
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
