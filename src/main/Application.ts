import * as electron from 'electron';
import { URL } from 'url';

import { ActionReceiver } from '../actions/ActionReceiver';
import { MainTransport } from '../actions/transports/MainTransport';
import { PROTOCOL } from '../constants';
import * as github from '../services/github';
import { realms } from '../services/ros';
import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
  WindowType,
} from '../windows/WindowType';
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

  private actionHandlers = {
    [MainActions.AuthenticateWithGitHub]: () => {
      return github.authenticate();
    },
    [MainActions.CheckForUpdates]: () => {
      this.checkForUpdates();
    },
    [MainActions.ShowCloudAdministration]: () => {
      return this.showCloudAdministration();
    },
    [MainActions.ShowConnectToServer]: (url?: string) => {
      return this.showConnectToServer(url);
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
    // this.makeSingleton(); // TODO: Re-enable and test on windows
    this.addAppListeners();
    // If its already ready - the handler won't be called
    if (electron.app.isReady()) {
      this.onReady();
    }
  }

  public destroy() {
    this.removeAppListeners();
    this.unregisterProtocols();
    this.updater.destroy();
    this.windowManager.closeAllWindows();
  }

  public userDataPath(): string {
    return electron.app.getPath('userData');
  }

  // Implementation of action handlers below

  public async showConnectToServer(url?: string) {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow(
        WindowType.ConnectToServer,
        {
          url,
        },
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

  public showCloudAdministration() {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow(
        WindowType.CloudAdministration,
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
    electron.app.addListener('open-url', this.onOpenUrl);
    electron.app.addListener('window-all-closed', this.onWindowAllClosed);
    electron.app.addListener('web-contents-created', this.onWebContentsCreated);
  }

  private removeAppListeners() {
    electron.app.removeListener('ready', this.onReady);
    electron.app.removeListener('activate', this.onActivate);
    electron.app.removeListener('open-file', this.onOpenFile);
    electron.app.removeListener('open-url', this.onOpenUrl);
    electron.app.removeListener('window-all-closed', this.onWindowAllClosed);
    electron.app.removeListener(
      'web-contents-created',
      this.onWebContentsCreated,
    );
  }

  private onReady = () => {
    this.mainMenu.set();
    this.showGreeting();
    electron.app.focus();
    this.registerProtocols();
  };

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      this.showGreeting();
    }
  };

  private onOpenFile = () => {
    this.showOpenLocalRealm();
  };

  private onOpenUrl = (event: Event, urlString: string) => {
    const url = new URL(urlString);
    if (url.protocol === `${PROTOCOL}:`) {
      // The protocol stores the action as the URL hostname
      const action = url.hostname;
      if (action === github.OPEN_URL_ACTION) {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        if (!code || !state) {
          throw new Error('Missing the code or state');
        } else {
          github.handleOauthCallback({ code, state });
        }
      }
    }
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

  private registerProtocols() {
    // Register this app as the default client for 'x-realm-studio://'
    const success = electron.app.setAsDefaultProtocolClient(PROTOCOL);

    if (success) {
      electron.dialog.showErrorBox(
        'Failed when registering protocols',
        'Studio could not register the x-realm-studio:// protocol. For this reason, you might not be able to log into Studio.',
      );
    }
  }

  private unregisterProtocols() {
    electron.app.removeAsDefaultProtocolClient(PROTOCOL);
  }

  private makeSingleton() {
    const isSecond = electron.app.makeSingleInstance(this.onInstanceStarted);
    if (isSecond) {
      // Quit the app if started multiple times
      electron.app.quit();
    }
  }

  private onInstanceStarted = (argv: string[], workingDirectory: string) => {
    // TODO: Restore and focus the GreetingWindow
  };
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
