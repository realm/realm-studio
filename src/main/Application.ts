import * as electron from 'electron';

import * as path from 'path';
import { MainReceiver } from '../actions/main';
import { MainTransport } from '../actions/transports/MainTransport';
import { getDataImporter, ImportFormat } from '../services/data-importer';
import ImportSchemaGenerator from '../services/data-importer/ImportSchemaGenerator';
import { realms } from '../services/ros';

import {
  IRealmBrowserOptions,
  IServerAdministrationOptions,
  WindowType,
} from '../windows/WindowType';
import { CertificateManager } from './CertificateManager';
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
    [MainActions.ShowImportData]: (format: ImportFormat) => {
      return this.showImportData(format);
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

  // Instantiate a receiver that will receive actions from the main process itself.
  private loopbackReceiver = new MainReceiver(this.actionHandlers);

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
    this.loopbackReceiver.destroy();
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
    return new Promise((resolve, reject) => {
      electron.dialog.showOpenDialog(
        {
          properties: ['openFile'],
          filters: [{ name: 'Realm Files', extensions: ['realm'] }],
        },
        selectedPaths => {
          if (selectedPaths) {
            selectedPaths.forEach(selectedPath => {
              const options: IRealmBrowserOptions = {
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
            const options: IRealmBrowserOptions = {
              realm: {
                mode: realms.RealmLoadingMode.Local,
                path: generatedRealm.path,
              },
            };
            this.showRealmBrowser(options).then(resolve, reject);
          }
        },
      );
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
    this.setDefaultMenu();
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

  private setDefaultMenu() {
    const menuTemplate = getDefaultMenuTemplate();
    const menu = electron.Menu.buildFromTemplate(menuTemplate);
    electron.Menu.setApplicationMenu(menu);
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
