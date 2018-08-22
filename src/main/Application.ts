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

import * as sentry from '@sentry/electron';
import * as electron from 'electron';
import * as path from 'path';
import { URL } from 'url';

import { MainReceiver } from '../actions/main';
import { CLOUD_PROTOCOL, STUDIO_PROTOCOL } from '../constants';
import * as dataImporter from '../services/data-importer';
import * as github from '../services/github';
import * as raas from '../services/raas';
import { realms } from '../services/ros';
import { showError } from '../ui/reusable/errors';
import {
  ICloudAuthenticationWindowProps,
  IConnectToServerWindowProps,
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
} from '../windows/WindowProps';

import { CertificateManager } from './CertificateManager';
import { CloudManager, ICloudStatus } from './CloudManager';
import { MainActions } from './MainActions';
import { getDefaultMenuTemplate } from './MainMenu';
import { Updater } from './Updater';
import { WindowManager } from './WindowManager';

export class Application {
  public static sharedApplication = new Application();

  private updater = new Updater();
  private windowManager = new WindowManager();
  private certificateManager = new CertificateManager();
  private cloudManager = new CloudManager();

  // Saving a reference for a single greeting window
  private greetingWindow?: electron.BrowserWindow;

  private actionHandlers = {
    [MainActions.AuthenticateWithEmail]: (email: string, password: string) => {
      return this.authenticateWithEmail(email, password);
    },
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
    [MainActions.ReopenGitHubUrl]: () => {
      this.cloudManager.reopenGitHubUrl();
    },
    [MainActions.SetRaasEndpoint]: (endpoint: raas.Endpoint) => {
      return this.setRaasEndpoint(endpoint);
    },
    [MainActions.ShowCloudAuthentication]: (
      props: ICloudAuthenticationWindowProps,
      resolveUser: boolean,
    ) => {
      return this.showCloudAuthentication(props, resolveUser);
    },
    [MainActions.ShowConnectToServer]: (url?: string) => {
      return this.showConnectToServer({ url });
    },
    [MainActions.ShowGreeting]: () => {
      return this.showGreeting();
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
    [MainActions.ShowServerAdministration]: (
      props: IServerAdministrationWindowProps,
    ) => {
      return this.showServerAdministration(props);
    },
  };

  // Instantiate a receiver that will receive actions from the main process itself.
  private loopbackReceiver = new MainReceiver(this.actionHandlers);

  // All files opened while app is loading will be stored on this array and opened when app is ready
  private delayedRealmOpens: string[] = [];
  // All urls opened while app is loading will be stored in this array and upened when app is ready
  private delayedUrlOpens: string[] = [];

  public run() {
    // Check to see if this is the first instance or not
    const hasAnotherInstance = electron.app.makeSingleInstance(
      this.onInstanceStarted,
    );

    if (hasAnotherInstance) {
      // Quit the app if started multiple times
      electron.app.quit();
    } else {
      // Clean up from any renderer processes
      this.windowManager.cleanupRendererProcessDirectories();
      // Register as a listener for specific URLs
      this.registerProtocols();
      // In Mac we detect the files opened with `open-file` event otherwise we need get it from `process.argv`
      if (process.platform !== 'darwin') {
        this.processArguments(process.argv);
      }
      // Register all app listeners
      this.addAppListeners();
      this.cloudManager.addListener(this.onCloudStatusChange);
      // If its already ready - the handler won't be called
      if (electron.app.isReady()) {
        this.onReady();
      }
    }
  }

  public destroy() {
    this.removeAppListeners();
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

  public async authenticateWithEmail(email: string, password: string) {
    return this.cloudManager.authenticateWithEmail(email, password);
  }

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

  public async showConnectToServer(props: IConnectToServerWindowProps) {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow({
        type: 'connect-to-server',
        props,
      });
      window.show();
      window.webContents.once('did-finish-load', () => {
        resolve();
      });
    });
  }

  public showGreeting() {
    if (this.greetingWindow) {
      this.greetingWindow.focus();
      return Promise.resolve();
    } else {
      return new Promise(resolve => {
        const window = this.windowManager.createWindow({
          type: 'greeting',
          props: {},
        });
        // Save this for later
        this.greetingWindow = window;
        // Show the window, the first time its ready-to-show
        window.once('ready-to-show', () => {
          window.show();
          resolve();
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
          delete this.greetingWindow;
        });
      });
    }
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
    // Get the importer
    const importer = dataImporter.getDataImporter(format, paths, schema);
    // Start the import
    const defaultPath = path.dirname(paths[0]) + '/default.realm';
    const destinationPath = electron.dialog.showSaveDialog({
      defaultPath,
      title: 'Choose where to store the imported data',
      filters: [{ name: 'Realm file', extensions: ['realm'] }],
    });
    if (!destinationPath) {
      // Don't do anything if the user cancelled or selected no files
      return;
    }
    const generatedRealm = importer.import(destinationPath);
    // Close Realm in main process (to be opened in Renderer process)
    generatedRealm.close();
    // Open a RealmBrowser using the generated Realm file.
    return this.openLocalRealmAtPath(generatedRealm.path);
  }

  public showRealmBrowser(props: IRealmBrowserWindowProps) {
    return new Promise(resolve => {
      const window = this.windowManager.createWindow({
        type: 'realm-browser',
        props,
      });
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
      const window = this.windowManager.createWindow({
        type: 'server-administration',
        props,
      });
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

  public showCloudAuthentication(
    props: ICloudAuthenticationWindowProps,
    resolveUser: boolean = false,
  ): Promise<raas.user.IAccountResponse> {
    return new Promise((resolve, reject) => {
      const window = this.windowManager.createWindow({
        type: 'cloud-authentication',
        props,
      });
      const listener = (status: ICloudStatus) => {
        if (status.kind === 'authenticated') {
          this.cloudManager.removeListener(listener);
          resolve(status.account);
          // Close the window once we're authenticated
          window.close();
        } else if (status.kind === 'error') {
          this.cloudManager.removeListener(listener);
          reject(new Error(status.message));
        }
      };
      this.cloudManager.addListener(listener);
      // Reject the promise if the window is closed before cloud status turns authenticated
      window.once('close', () => {
        // We need a timeout here, because the close event fires before the cloud status updates
        reject(new Error('Window was closed instead of authenticating'));
        this.cloudManager.removeListener(listener);
        this.cloudManager.abortPendingGitHubAuthentications();
      });
      // If resolveUser is false - we resolve the promise as soon as the window loads
      if (!resolveUser) {
        window.webContents.once('did-finish-load', () => {
          resolve();
        });
      }
      window.show();
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
    if (!electron.app.isReady()) {
      this.delayedRealmOpens.push(filePath);
    } else {
      this.openLocalRealmAtPath(filePath).catch(err =>
        showError(`Failed opening the file "${filePath}"`, err),
      );
    }
  };

  private onOpenUrl = (event: Event | undefined, urlString: string) => {
    if (electron.app.isReady()) {
      const url = new URL(urlString);
      if (url.protocol === `${STUDIO_PROTOCOL}:`) {
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
      } else if (url.protocol === `${CLOUD_PROTOCOL}:`) {
        this.openCloudUrl(url).catch((err: Error) => {
          showError('Could not open Realm Cloud URL', err);
        });
      }
    } else {
      this.delayedUrlOpens.push(urlString);
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
    if (status.kind === 'authenticated') {
      // Add the users account into the context for Raven to consume
      const { id, email, nameFirst, nameLast, ...rest } = status.account;
      sentry.configureScope(scope => {
        scope.setUser({
          id,
          email,
          extra: { ...rest, name: `${nameFirst} ${nameLast}` },
        });
      });
    }
  };

  private registerProtocols() {
    this.registerProtocol(CLOUD_PROTOCOL);
    this.registerProtocol(STUDIO_PROTOCOL);
  }

  /**
   * If not already - register this as the default protocol client for a protocol
   */
  private registerProtocol(protocol: string) {
    if (!electron.app.isDefaultProtocolClient(protocol)) {
      const success = electron.app.setAsDefaultProtocolClient(protocol);
      if (!success) {
        electron.dialog.showErrorBox(
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
    argv: string[],
    workingDirectory: string,
  ) => {
    this.processArguments(argv);
    await this.showGreeting();
    this.performDelayedTasks();
  };

  private setDefaultMenu = () => {
    const menuTemplate = getDefaultMenuTemplate(this.setDefaultMenu);
    const menu = electron.Menu.buildFromTemplate(menuTemplate);
    electron.Menu.setApplicationMenu(menu);
  };

  private async openCloudUrl(url: URL): Promise<void> {
    // Test that any user id matches the currently authenticated user
    const currentUser = raas.user.hasToken() ? await raas.user.getAuth() : null;
    if (url.username) {
      try {
        if (!currentUser) {
          await this.cloudManager.deauthenticate();
          const newUser = await this.showCloudAuthentication({}, true);
          // Retry
          return this.openCloudUrl(url);
        } else if (url.username !== currentUser.id) {
          const answer = electron.dialog.showMessageBox({
            type: 'warning',
            message: `You're trying to connect to a cloud instance that is not owned by you.\n\nDo you want to login as another user?`,
            buttons: ['Yes, login with another user!', 'No, abort!'],
            defaultId: 0,
            cancelId: 1,
          });
          if (answer === 1) {
            // Abort!
            return;
          } else {
            await this.cloudManager.deauthenticate();
            const newUser = await this.showCloudAuthentication({}, true);
            // Retry
            return this.openCloudUrl(url);
          }
        }
      } catch (err) {
        // We consider closing the window aborting the opening
        if (err.message === 'Window was closed') {
          // Abort!
          return;
        } else {
          throw err;
        }
      }
    }

    // Check the hostname to ensure it ends on a trusted domain
    const trustedHosts = ['.realm.io', '.realmlab.net'];
    const trusted = trustedHosts.reduce((result, host) => {
      return result || url.host.endsWith(host);
    }, false);

    const serverUrl = new URL(`https://${url.host}`);

    if (!trusted) {
      const answer = electron.dialog.showMessageBox({
        type: 'warning',
        message: `You're about to connect to ${serverUrl.toString()}.\n\nThis will reveal your cloud token to the server. Do you wish to proceed?`,
        buttons: ['Yes, connect!', 'No, abort!'],
        defaultId: 0,
        cancelId: 1,
      });
      if (answer === 1) {
        // Abort!
        return;
      }
    }

    await this.showServerAdministration({
      credentials: raas.user.getTenantCredentials(serverUrl.toString()),
      isCloudTenant: true,
      validateCertificates: true,
    });
  }

  private openLocalRealmAtPath = (filePath: string) => {
    return this.showRealmBrowser({
      realm: {
        mode: realms.RealmLoadingMode.Local,
        path: filePath,
      },
    });
  };

  private processArguments(argv: string[]) {
    this.delayedRealmOpens = argv.filter(arg => {
      return arg.endsWith('.realm');
    });
    this.delayedUrlOpens = argv.filter(arg => {
      return (
        arg.startsWith(`${CLOUD_PROTOCOL}://`) ||
        arg.startsWith(`${STUDIO_PROTOCOL}://`)
      );
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

    // Open any URLs that the app was not ready to open during startup
    const urlsOpened = this.delayedUrlOpens.map(url => {
      return this.onOpenUrl(undefined, url);
    });
    // Reset the array to prevent double opening
    this.delayedUrlOpens = [];
    // Wait for all realms to open or show an error on failure
    await Promise.all(urlsOpened).catch(err =>
      showError(`Failed opening URL`, err),
    );
  }
}

if (module.hot) {
  module.hot.dispose(() => {
    Application.sharedApplication.destroy();
  });
}
