import * as electron from 'electron';
import { URL } from 'url';

import * as path from 'path';
import { MainReceiver } from '../actions/main';
import { MainTransport } from '../actions/transports/MainTransport';
import { PROTOCOL } from '../constants';
import { getDataImporter, ImportFormat } from '../services/data-importer';
import ImportSchemaGenerator from '../services/data-importer/ImportSchemaGenerator';
import * as github from '../services/github';
import * as raas from '../services/raas';
import { realms } from '../services/ros';

import {
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
  ITutorialWindowProps,
  WindowType,
} from '../windows/WindowType';
import { CertificateManager } from './CertificateManager';
import { CloudManager, ICloudStatus } from './CloudManager';
import { MainActions } from './MainActions';
import { getDefaultMenuTemplate } from './MainMenu';
import { Updater } from './Updater';
import { WindowManager } from './WindowManager';

const isProduction = process.env.NODE_ENV === 'production';

export class Application {
  public static sharedApplication = new Application();

  private updater = new Updater();
  private windowManager = new WindowManager();
  private certificateManager = new CertificateManager();
  private cloudManager = new CloudManager();

  private actionHandlers = {
    [MainActions.AuthenticateWithGitHub]: () => {
      return this.authenticateWithGitHub();
    },
    [MainActions.Deauthenticate]: () => {
      return this.deauthenticate();
    },
    [MainActions.CheckForUpdates]: () => {
      this.checkForUpdates();
    },
    [MainActions.RefreshCloudStatus]: () => {
      this.cloudManager.refresh();
    },
    [MainActions.SetRaasEndpoint]: (endpoint: raas.Endpoint) => {
      return this.setRaasEndpoint(endpoint);
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
    [MainActions.ShowImportData]: (format: ImportFormat) => {
      return this.showImportData(format);
    },
    [MainActions.ShowOpenLocalRealm]: () => {
      return this.showOpenLocalRealm();
    },
    [MainActions.ShowRealmBrowser]: (props: IRealmBrowserWindowProps) => {
      return this.showRealmBrowser(props);
    },
    [MainActions.ShowServerAdministration]: (
      props: IServerAdministrationWindowProps,
    ) => {
      return this.showServerAdministration(props);
    },
    [MainActions.ShowTutorial]: (options: ITutorialWindowProps) => {
      return this.showTutorial(options);
    },
  };

  // Instantiate a receiver that will receive actions from the main process itself.
  private loopbackReceiver = new MainReceiver(this.actionHandlers);

  public run() {
    // this.makeSingleton(); // TODO: Re-enable and test on windows
    this.addAppListeners();
    this.cloudManager.addListener(this.onCloudStatusChange);
    // If its already ready - the handler won't be called
    if (electron.app.isReady()) {
      this.onReady();
    }
  }

  public destroy() {
    this.removeAppListeners();
    this.unregisterProtocols();
    this.updater.destroy();
    this.certificateManager.destroy();
    this.cloudManager.removeListener(this.onCloudStatusChange);
    this.windowManager.closeAllWindows();
    this.certificateManager.destroy();
    this.loopbackReceiver.destroy();
  }

  public userDataPath(): string {
    return electron.app.getPath('userData');
  }

  // Implementation of action handlers below

  public async authenticateWithGitHub() {
    return this.cloudManager.authenticateWithGitHub();
  }

  public deauthenticate() {
    return this.cloudManager.deauthenticate();
  }

  public setRaasEndpoint(endpoint: raas.Endpoint) {
    this.cloudManager.setEndpoint(endpoint);
    this.cloudManager.deauthenticate();
  }

  public async showConnectToServer(url?: string) {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow({
        type: 'connect-to-server',
        url,
      });
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
    });
  }

  public showGreeting() {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow({
        type: 'greeting',
      });
      // Show the window, the first time its ready-to-show
      window.once('ready-to-show', () => {
        window.show();
      });
      // Check for updates, every time the contents has loaded
      window.webContents.on('did-finish-load', () => {
        this.updater.checkForUpdates(true);
        this.cloudManager.refresh();
      });
      this.updater.addListeningWindow(window);
      this.cloudManager.addListeningWindow(window);
      window.once('close', () => {
        this.updater.removeListeningWindow(window);
        this.cloudManager.removeListeningWindow(window);
      });
    });
  }

  public showOpenLocalRealm() {
    return new Promise((resolve, reject) => {
      electron.dialog.showOpenDialog(
        {
          properties: ['openFile'],
          filters: [{ name: 'Realm Files', extensions: ['realm'] }],
        },
        selectedPaths => {
          if (selectedPaths) {
            selectedPaths.forEach(selectedPath => {
              const options: IRealmBrowserWindowProps = {
                type: 'realm-browser',
                realm: {
                  mode: realms.RealmLoadingMode.Local,
                  path: selectedPath,
                },
              };
              this.showRealmBrowser(options).then(resolve, reject);
            });
          }
        },
      );
    });
  }

  public showImportData(format: ImportFormat) {
    return new Promise((resolve, reject) => {
      electron.dialog.showOpenDialog(
        {
          properties: ['openFile', 'multiSelections'],
          filters: [{ name: 'CSV File(s)', extensions: ['csv', 'CSV'] }],
        },
        selectedPaths => {
          if (selectedPaths) {
            // Generate the Realm from the provided CSV file(s)
            const schemaGenerator = new ImportSchemaGenerator(
              ImportFormat.CSV,
              selectedPaths,
            );
            const schema = schemaGenerator.generate();
            const importer = getDataImporter(format, selectedPaths, schema);
            const generatedRealm = importer.import(
              path.dirname(selectedPaths[0]),
            );
            // close Realm in main process (to be opened in Renderer process)
            generatedRealm.close();

            // Open a RealmBrowser using the generated Realm file.
            const props: IRealmBrowserWindowProps = {
              type: 'realm-browser',
              realm: {
                mode: realms.RealmLoadingMode.Local,
                path: generatedRealm.path,
              },
            };
            this.showRealmBrowser(props).then(resolve, reject);
          }
        },
      );
    });
  }

  public showRealmBrowser(props: IRealmBrowserWindowProps) {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow(props);
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
    });
  }

  public showServerAdministration(props: IServerAdministrationWindowProps) {
    return new Promise(resolve => {
      // TODO: Change this once the realm-js Realm.Sync.User serializes correctly
      // @see https://github.com/realm/realm-js/issues/1276
      const window = this.windowManager.createWindow(props);
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
      if (props.isCloudTenant) {
        this.cloudManager.addListeningWindow(window);
        window.once('close', () => {
          this.cloudManager.removeListeningWindow(window);
        });
      }
    });
  }

  public showTutorial(props: ITutorialWindowProps) {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow(props);
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
    });
  }

  public showCloudAdministration() {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow({
        type: 'cloud-administration',
      });
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
    this.setDefaultMenu();
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
    } else {
      this.setDefaultMenu();
    }
  };

  private onWebContentsCreated = (
    event: Electron.Event,
    webContents: Electron.WebContents,
  ) => {
    const receiver = new MainReceiver(this.actionHandlers, webContents);
    webContents.once('destroyed', () => {
      receiver.destroy();
    });
  };

  private onCloudStatusChange = (status: ICloudStatus) => {
    // Refresh the menu, as the authentication state might have changed
    // this.mainMenu.update();
    // TODO: Update the main menu
  };

  private registerProtocols() {
    // Register this app as the default client for 'x-realm-studio://'
    const success = electron.app.setAsDefaultProtocolClient(PROTOCOL);
    if (!success) {
      electron.dialog.showErrorBox(
        'Failed when registering protocols',
        'Studio could not register the x-realm-studio:// protocol. For this reason, you might not be able to log into Studio.',
      );
    }
  }

  private unregisterProtocols() {
    const success = electron.app.removeAsDefaultProtocolClient(PROTOCOL);
    if (!success) {
      electron.dialog.showErrorBox(
        'Failed when unregistering protocols',
        'Studio could not unregister the x-realm-studio:// protocol.',
      );
    }
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

  private setDefaultMenu = () => {
    const menuTemplate = getDefaultMenuTemplate(this.setDefaultMenu);
    const menu = electron.Menu.buildFromTemplate(menuTemplate);
    electron.Menu.setApplicationMenu(menu);
  };
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
