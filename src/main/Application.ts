import * as electron from 'electron';

import { ActionReceiver } from '../actions/ActionReceiver';
import { MainTransport } from '../actions/transports/MainTransport';
import { realms } from '../services/ros';
import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
  WindowType,
} from '../windows/WindowType';
import { CertificateManager } from './CertificateManager';
import { MainActions } from './MainActions';
import { MainMenu } from './MainMenu';
import { Updater } from './Updater';
import { WindowManager } from './WindowManager';

const isProduction = process.env.NODE_ENV === 'production';

export class Application {
  public static sharedApplication = new Application();

  private mainMenu = new MainMenu();
  private updater = new Updater();
  private windowManager = new WindowManager();
  private certificateManager = new CertificateManager();

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
    this.certificateManager.destroy();
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
                  mode: realms.RealmLoadingMode.Local,
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

      window.on('blur', () => {
        this.mainMenu.enableExportSchemaOption(false);
      });

      window.on('focus', () => {
        this.mainMenu.enableExportSchemaOption(true);
      });

      window.on('close', () => {
        this.mainMenu.enableExportSchemaOption(false);
      });

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
