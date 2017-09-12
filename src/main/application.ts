import * as electron from "electron";
import * as Realm from "realm";

import { Actions } from "../actions";
import {
  ILocalRealmBrowserOptions,
  IRealmBrowserOptions,
  IServerAdministrationOptions,
  RealmBrowserMode,
  WindowType,
} from "../windows/WindowType";
import MainMenu from "./main-menu";
import WindowManager from "./window-manager";

export default class Application {
  public static sharedApplication = new Application();

  private mainMenu = new MainMenu();
  private windowManager = new WindowManager();

  private actions: { [action: string]: (event: Electron.IpcMessageEvent, ...args: any[]) => void } = {
    [Actions.ShowConnectToServer]: (event, ...args) => {
      this.showConnectToServer();
      event.returnValue = true;
    },
    [Actions.ShowGreeting]: (event, ...args) => {
      this.showGreeting();
      event.returnValue = true;
    },
    [Actions.ShowOpenLocalRealm]: (event, ...args) => {
      this.showOpenLocalRealm();
      event.returnValue = true;
    },
    [Actions.ShowRealmBrowser]: (event, ...args) => {
      this.showRealmBrowser(args[0] as IRealmBrowserOptions);
      event.returnValue = true;
    },
    [Actions.ShowServerAdministration]: (event, ...args) => {
      this.showServerAdministration(args[0] as IServerAdministrationOptions);
      event.returnValue = true;
    },
  };

  public run() {
    this.addAppListeners();
    this.addActionListeners();
    // If its already ready - the handler won't be called
    if (electron.app.isReady()) {
      this.onReady();
    }
  }

  public destroy() {
    this.removeAppListeners();
    this.removeActionListeners();
    this.windowManager.closeAllWindows();
  }

  public userDataPath(): string {
    return electron.app.getPath("userData");
  }

  // Implementation of action handlers below

  public showConnectToServer() {
    const window = this.windowManager.createWindow(WindowType.ConnectToServer);
    window.once("ready-to-show", () => {
      window.show();
    });
  }

  public showGreeting() {
    const window = this.windowManager.createWindow(WindowType.Greeting);
    window.once("ready-to-show", () => {
      window.show();
    });
  }

  public showOpenLocalRealm() {
    electron.dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Realm Files", extensions: ["realm"] }],
    }, (selectedPaths) => {
      if (selectedPaths) {
        selectedPaths.forEach((path) => {
          this.showRealmBrowser({
            mode: RealmBrowserMode.Local,
            path,
          } as ILocalRealmBrowserOptions);
        });
      }
    });
  }

  public showRealmBrowser(options: IRealmBrowserOptions) {
    const window = this.windowManager.createWindow(WindowType.RealmBrowser, options);
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

  private addActionListeners() {
    Object.keys(this.actions).forEach((action: string) => {
      const handler = this.actions[action];
      electron.ipcMain.addListener(action, handler);
    });
  }

  private removeActionListeners() {
    Object.keys(this.actions).forEach((action: string) => {
      const handler = this.actions[action];
      electron.ipcMain.removeListener(action, handler);
    });
  }

  private onReady = () => {
    this.mainMenu.set();
    // this.showOpenLocalRealm();
    // this.showConnectToServer();
    this.showGreeting();

    electron.app.focus();
  }

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      this.showGreeting();
    }
  }

  private onOpenFile = () => {
    this.showOpenLocalRealm();
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
