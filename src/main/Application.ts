import * as electron from 'electron';

import * as path from 'path';
import { MainReceiver } from '../actions/main';
import { getDataImporter, ImportFormat } from '../services/data-importer';
import ImportSchemaGenerator from '../services/data-importer/ImportSchemaGenerator';
import { realms } from '../services/ros';
import { showError } from '../ui/reusable/errors';
import {
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
} from '../windows/WindowType';

import { CertificateManager } from './CertificateManager';
import { MainActions } from './MainActions';
import { getDefaultMenuTemplate } from './MainMenu';
import { Updater } from './Updater';
import { WindowManager } from './WindowManager';

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
    [MainActions.ShowRealmBrowser]: (props: IRealmBrowserWindowProps) => {
      return this.showRealmBrowser(props);
    },
    [MainActions.ShowServerAdministration]: (
      props: IServerAdministrationWindowProps,
    ) => {
      return this.showServerAdministration(props);
    },
  };

  // Instantiate a receiver that will receive actions from the main process itself.
  private loopbackReceiver = new MainReceiver(this.actionHandlers);

  // All files opened while app is loading will be stored on this array and opened when app is ready
  private realmsToBeLoaded: string[] = [];

  public run() {
    // In Mac we detect the files opened with `open-file` event otherwise we need get it from `process.argv`
    if (process.platform !== 'darwin') {
      this.realmsToBeLoaded = process.argv.filter(arg => {
        return arg.indexOf('.realm') >= 0;
      });
    }

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
      const window = this.windowManager.createWindow({
        type: 'connect-to-server',
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
        resolve();
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
          properties: ['openFile', 'multiSelections'],
          filters: [{ name: 'Realm Files', extensions: ['realm'] }],
        },
        selectedPaths => {
          if (selectedPaths) {
            const realmsLoaded = selectedPaths.map(selectedPath => {
              return this.openLocalRealmAtPath(selectedPath);
            });
            // Call Resolve or reject when all realms are opened or a single fails
            Promise.all(realmsLoaded).then(resolve, reject);
          } else {
            // Nothing loaded
            resolve();
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
            this.openLocalRealmAtPath(generatedRealm.path).then(
              resolve,
              reject,
            );
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

  private onReady = async () => {
    this.setDefaultMenu();
    // Wait for the greeting window to show
    await this.showGreeting();
    // Open all the realms to be loaded
    const realmsLoaded = this.realmsToBeLoaded.map(realmPath => {
      return this.openLocalRealmAtPath(realmPath);
    });
    // Wait for all realms to open or show an error on failure
    await Promise.all(realmsLoaded).catch(err =>
      showError(`Failed opening Realm`, err),
    );
    // Reset the array to prevent any double loading
    this.realmsToBeLoaded = [];
  };

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      this.showGreeting();
    }
  };

  private onOpenFile = (event: Electron.Event, filePath: string) => {
    event.preventDefault();
    if (!electron.app.isReady()) {
      this.realmsToBeLoaded.push(filePath);
    } else {
      this.openLocalRealmAtPath(filePath).catch(err =>
        showError(`Failed opening the file "${filePath}"`, err),
      );
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

  private setDefaultMenu() {
    const menuTemplate = getDefaultMenuTemplate();
    const menu = electron.Menu.buildFromTemplate(menuTemplate);
    electron.Menu.setApplicationMenu(menu);
  }

  private openLocalRealmAtPath = (filePath: string) => {
    const props: IRealmBrowserWindowProps = {
      type: 'realm-browser',
      realm: {
        mode: realms.RealmLoadingMode.Local,
        path: filePath,
      },
    };
    return this.showRealmBrowser(props);
  };
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
