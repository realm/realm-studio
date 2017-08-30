import * as electron from "electron";

import { WindowType } from "../windows/WindowType";
import MainMenu from "./main-menu";
import WindowManager from "./window-manager";

export default class Application {
  public static sharedApplication = new Application();

  private mainMenu = new MainMenu();
  private windowManager = new WindowManager();

  public run() {
    this.addAppListeners();
  }

  public destroy() {
    this.removeAppListeners();
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

  private onReady = () => {
    this.mainMenu.set();
    this.showOpenDialog();

    electron.app.focus();
  }

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      this.showOpenDialog();
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
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
