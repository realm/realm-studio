////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import { app, dialog, Menu } from 'electron';
import path from 'path';

import { MainReceiver } from '../actions/main';
import { CLOUD_PROTOCOL, STUDIO_PROTOCOL } from '../constants';
import * as dataImporter from '../services/data-importer';
import { showError } from '../ui/reusable/errors';
import { RealmLoadingMode } from '../utils/realms';
import { IRealmBrowserWindowProps } from '../windows/WindowProps';

import { removeRendererDirectories } from '../utils';
import { CertificateManager } from './CertificateManager';
import { MainActions } from './MainActions';
import { getDefaultMenuTemplate } from './MainMenu';
import { Updater } from './Updater';
import { WindowManager } from './WindowManager';

export class Application {
  public static sharedApplication = new Application();

  private windowManager = new WindowManager();
  private updater = new Updater(this.windowManager);
  private certificateManager = new CertificateManager();

  private actionHandlers = {
    [MainActions.CheckForUpdates]: () => {
      this.checkForUpdates();
    },
    [MainActions.ShowImportData]: (format: dataImporter.ImportFormat) => {
      return this.showImportData(format);
    },
    [MainActions.ShowOpenLocalRealm]: () => {
      return this.showOpenLocalRealm();
    },
    [MainActions.ShowRealmBrowser]: (props: IRealmBrowserWindowProps) => {
      return this.showRealmBrowser(props);
    },
    [MainActions.ClearRendererCache]: async () => {
      await this.windowManager.closeAllWindows();
      await removeRendererDirectories();
      await this.showGreeting();
    },
  };

  // Instantiate a receiver that will receive actions from the main process itself.
  private loopbackReceiver = new MainReceiver(this.actionHandlers);

  // All files opened while app is loading will be stored on this array and opened when app is ready
  private delayedRealmOpens: string[] = [];

  public run() {
    // Check to see if this is the first instance or not
    const hasAnotherInstance = app.requestSingleInstanceLock() === false;

    if (hasAnotherInstance) {
      // Quit the app if started multiple times
      app.quit();
    } else {
      // Register as a listener for specific URLs
      this.registerProtocols();
      // In Mac we detect the files opened with `open-file` event otherwise we need get it from `process.argv`
      if (process.platform !== 'darwin') {
        this.processArguments(process.argv);
      }
      // Register all app listeners
      this.addAppListeners();
      // If its already ready - the handler won't be called
      if (app.isReady()) {
        this.onReady();
      }
      // Handle any second instances of the Application
      app.on('second-instance', this.onInstanceStarted);
    }
  }

  public destroy() {
    this.removeAppListeners();
    this.updater.destroy();
    this.certificateManager.destroy();
    this.windowManager.closeAllWindows();
    this.certificateManager.destroy();
    this.loopbackReceiver.destroy();
  }

  public userDataPath(): string {
    return app.getPath('userData');
  }

  // Implementation of action handlers below

  public showGreeting(): Promise<void> {
    const { window, existing } = this.windowManager.createWindow({
      type: 'greeting',
      props: {},
    });

    if (existing) {
      window.focus();
      return Promise.resolve();
    } else {
      return new Promise(resolve => {
        // Save this for later
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
  }

  public async showOpenLocalRealm() {
    const response = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Realm Files', extensions: ['realm'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    const realmsLoaded = response.filePaths.map(filePath =>
      this.openLocalRealmAtPath(filePath),
    );
    // Resolves when all realms are opened or rejects when a single realm fails
    return Promise.all(realmsLoaded);
  }

  public showImportData(format: dataImporter.ImportFormat) {
    // Ask the users for the file names of files to import
    const paths = dataImporter.showOpenDialog(format);
    if (!paths || paths.length === 0) {
      // Don't do anything if the user cancelled or selected no files
      return;
    }
    // Generate the Realm from the provided CSV file(s)
    const schema = dataImporter.generateSchema(
      dataImporter.ImportFormat.CSV,
      paths,
    );
    // Start the import
    const defaultPath = path.dirname(paths[0]) + '/default.realm';
    const destinationPath = dialog.showSaveDialogSync({
      defaultPath,
      title: 'Choose where to store the imported data',
      filters: [{ name: 'Realm file', extensions: ['realm'] }],
    });
    if (!destinationPath) {
      // Don't do anything if the user cancelled or selected no files
      return;
    }
    // Open the Realm Browser, which will perform the import
    return this.showRealmBrowser({
      realm: {
        mode: RealmLoadingMode.Local,
        path: destinationPath,
      },
      import: { format, paths, schema },
    });
  }

  public showRealmBrowser(props: IRealmBrowserWindowProps): Promise<void> {
    const { window, existing } = this.windowManager.createWindow({
      type: 'realm-browser',
      props,
    });

    if (existing) {
      window.focus();
      return Promise.resolve();
    } else {
      return new Promise(resolve => {
        // Set the represented filename
        if (process.platform === 'darwin' && props.realm.mode === 'local') {
          window.setRepresentedFilename(props.realm.path);
        }
        window.show();
        window.webContents.once('did-finish-load', () => {
          resolve();
        });
      });
    }
  }

  public checkForUpdates() {
    this.updater.checkForUpdates();
  }

  private addAppListeners() {
    app.addListener('ready', this.onReady);
    app.addListener('activate', this.onActivate);
    app.addListener('open-file', this.onOpenFile);
    app.addListener('window-all-closed', this.onWindowAllClosed);
    app.addListener('web-contents-created', this.onWebContentsCreated);
  }

  private removeAppListeners() {
    app.removeListener('ready', this.onReady);
    app.removeListener('activate', this.onActivate);
    app.removeListener('open-file', this.onOpenFile);
    app.removeListener('window-all-closed', this.onWindowAllClosed);
    app.removeListener('web-contents-created', this.onWebContentsCreated);
  }

  private onReady = async () => {
    this.setDefaultMenu();
    if (this.windowManager.windows.length === 0) {
      // Wait for the greeting window to show - if no other windows are open
      await this.showGreeting();
    }
    this.performDelayedTasks();
  };

  private onActivate = () => {
    if (this.windowManager.windows.length === 0) {
      this.showGreeting();
    }
  };

  private onOpenFile = (e: Electron.Event, filePath: string) => {
    e.preventDefault();
    if (!app.isReady()) {
      this.delayedRealmOpens.push(filePath);
    } else {
      this.openLocalRealmAtPath(filePath).catch(err =>
        showError(`Failed opening the file "${filePath}"`, err),
      );
    }
  };

  private onWindowAllClosed = () => {
    if (process.platform !== 'darwin') {
      app.quit();
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

  private registerProtocols() {
    this.registerProtocol(CLOUD_PROTOCOL);
    this.registerProtocol(STUDIO_PROTOCOL);
  }

  /**
   * If not already - register this as the default protocol client for a protocol
   */
  private registerProtocol(protocol: string) {
    if (!app.isDefaultProtocolClient(protocol)) {
      const success = app.setAsDefaultProtocolClient(protocol);
      if (!success) {
        dialog.showErrorBox(
          'Failed when registering protocols',
          `Studio could not register the ${protocol}:// protocol.`,
        );
      }
    }
  }

  /**
   * This is called when another instance of the app is started on Windows or Linux
   */
  private onInstanceStarted = async (
    event: Event,
    argv: string[],
    workingDirectory: string,
  ) => {
    this.processArguments(argv);
    await this.showGreeting();
    this.performDelayedTasks();
  };

  private setDefaultMenu = () => {
    const menuTemplate = getDefaultMenuTemplate(this.setDefaultMenu);
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  };

  private openLocalRealmAtPath = (filePath: string) => {
    return this.showRealmBrowser({
      realm: {
        mode: RealmLoadingMode.Local,
        path: filePath,
      },
    });
  };

  private processArguments(argv: string[]) {
    this.delayedRealmOpens = argv.filter(arg => {
      return arg.endsWith('.realm');
    });
  }

  private async performDelayedTasks() {
    // Open all the realms to be loaded
    const realmsLoaded = this.delayedRealmOpens.map(realmPath => {
      return this.openLocalRealmAtPath(realmPath);
    });
    // Reset the array to prevent double loading
    this.delayedRealmOpens = [];
    // Wait for all realms to open or show an error on failure
    await Promise.all(realmsLoaded).catch(err =>
      showError(`Failed opening Realm`, err),
    );
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
