import * as electron from 'electron';

import { ActionReceiver } from '../actions/ActionReceiver';
import { MainTransport } from '../actions/transports/MainTransport';
import { RealmLoadingMode } from '../services/ros/types';
import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
  WindowType,
} from '../windows/WindowType';
import MainMenu from './main-menu';
import { MainActions } from './MainActions';
import Updater from './updater';
import WindowManager from './window-manager';

const isProduction = process.env.NODE_ENV === 'production';

export default class Application {
  public static sharedApplication = new Application();

  private mainMenu = new MainMenu();
  private updater = new Updater();
  private windowManager = new WindowManager();

  private actionHandlers = {
    [MainActions.CheckForUpdates]: () => {
      this.checkForUpdates();
    },
    [MainActions.ShowConnectToServer]: () => {
      return this.showConnectToServer();
    },
    [MainActions.ShowGreeting]: () => {
      return this.showGreeting();
    },
    [MainActions.ShowOpenLocalRealm]: () => {
      return this.showOpenLocalRealm();
    },
    [MainActions.ShowRealmBrowser]: (options: IRealmBrowserOptions) => {
      return this.showRealmBrowser(options);
    },
    [MainActions.ShowServerAdministration]: (
      options: IServerAdministrationOptions,
    ) => {
      return this.showServerAdministration(options);
    },
  };

  public run() {
    this.addAppListeners();
    // If its already ready - the handler won't be called
    if (electron.app.isReady()) {
      this.onReady();
    }
  }

  public destroy() {
    this.removeAppListeners();
    this.updater.destroy();
    this.windowManager.closeAllWindows();
  }

  public userDataPath(): string {
    return electron.app.getPath('userData');
  }

  // Implementation of action handlers below

  public async showConnectToServer() {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow(
        WindowType.ConnectToServer,
      );
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
    });
  }

  public showGreeting() {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow(WindowType.Greeting);
      // Show the window, the first time its ready-to-show
      window.once('ready-to-show', () => {
        window.show();
      });
      // Check for updates, every time the contents has loaded
      window.webContents.on('did-finish-load', () => {
        this.updater.checkForUpdates(true);
      });
      this.updater.addListeningWindow(window);
      window.once('close', () => {
        this.updater.removeListeningWindow(window);
      });
    });
  }

  public showOpenLocalRealm() {
    return new Promise(resolve => {
      electron.dialog.showOpenDialog(
        {
          properties: ['openFile'],
          filters: [{ name: 'Realm Files', extensions: ['realm'] }],
        },
        selectedPaths => {
          if (selectedPaths) {
            selectedPaths.forEach(path => {
              const options: IRealmBrowserOptions = {
                realm: {
                  mode: RealmLoadingMode.Local,
                  path,
                },
              };
              this.showRealmBrowser(options);
            });
          }
        },
      );
      resolve();
    });
  }

  public showRealmBrowser(options: IRealmBrowserOptions) {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow(
        WindowType.RealmBrowser,
        options,
      );
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
    });
  }

  public showServerAdministration(options: IServerAdministrationOptions) {
    return new Promise(resolve => {
      // TODO: Change this once the realm-js Realm.Sync.User serializes correctly
      // @see https://github.com/realm/realm-js/issues/1276
      const window = this.windowManager.createWindow(
        WindowType.ServerAdministration,
        options,
      );
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
    });
  }

  public checkForUpdates() {
    this.updater.checkForUpdates();
  }

  private addAppListeners() {
    electron.app.addListener('ready', this.onReady);
    electron.app.addListener('activate', this.onActivate);
    electron.app.addListener('open-file', this.onOpenFile);
    electron.app.addListener('window-all-closed', this.onWindowAllClosed);
    electron.app.addListener('web-contents-created', this.onWebContentsCreated);
  }

  private removeAppListeners() {
    electron.app.removeListener('ready', this.onReady);
    electron.app.removeListener('activate', this.onActivate);
    electron.app.removeListener('open-file', this.onOpenFile);
    electron.app.removeListener('window-all-closed', this.onWindowAllClosed);
    electron.app.removeListener(
      'web-contents-created',
      this.onWebContentsCreated,
    );
  }

  private onReady = () => {
    this.mainMenu.set();
    // this.showOpenLocalRealm();
    // this.showConnectToServer();
    this.showGreeting();
    electron.app.focus();
  };

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      this.showGreeting();
    }
  };

  private onOpenFile = () => {
    this.showOpenLocalRealm();
  };

  private onWindowAllClosed = () => {
    if (process.platform !== 'darwin') {
      electron.app.quit();
    }
  };

  private onWebContentsCreated = (
    event: Electron.Event,
    webContents: Electron.WebContents,
  ) => {
    const receiver = new ActionReceiver(this.actionHandlers);
    receiver.setTransport(new MainTransport(webContents));
  };
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
