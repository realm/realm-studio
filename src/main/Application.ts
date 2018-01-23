import * as electron from 'electron';
import { URL } from 'url';

import * as path from 'path';
import { MainReceiver } from '../actions/main';
import { CLOUD_PROTOCOL, STUDIO_PROTOCOL } from '../constants';
import { getDataImporter, ImportFormat } from '../services/data-importer';
import ImportSchemaGenerator from '../services/data-importer/ImportSchemaGenerator';
import * as github from '../services/github';
import * as raas from '../services/raas';
import { realms } from '../services/ros';
import { showError } from '../ui/reusable/errors';
import {
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
  ITutorialWindowProps,
} from '../windows/WindowType';

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
    [MainActions.SetRaasEndpoint]: (endpoint: raas.Endpoint) => {
      return this.setRaasEndpoint(endpoint);
    },
    [MainActions.ShowCloudAuthentication]: () => {
      return this.showCloudAuthentication();
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

  // All files opened while app is loading will be stored on this array and opened when app is ready
  private realmsToBeLoaded: string[] = [];
  // All urls opened while app is loading will be stored in this array and upened when app is ready
  private delayedUrlOpens: Array<{ event: Event; urlString: string }> = [];

  public run() {
    // Register as a listener for specific URLs
    this.registerProtocols();
    // In Mac we detect the files opened with `open-file` event otherwise we need get it from `process.argv`
    if (process.platform !== 'darwin') {
      this.realmsToBeLoaded = process.argv.filter(arg => {
        return arg.indexOf('.realm') >= 0;
      });
    }

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

  public showCloudAuthentication(
    resolveUser: boolean = false,
  ): Promise<raas.user.IMeResponse> {
    return new Promise((resolve, reject) => {
      const window = this.windowManager.createWindow({
        type: 'cloud-authentication',
      });
      // If resolve user is true - we wait for the authentication before resolving
      if (resolveUser) {
        const listener = (status: ICloudStatus) => {
          if (
            status.kind === 'authenticated' ||
            status.kind === 'has-primary-subscription'
          ) {
            this.cloudManager.removeListener(listener);
            resolve(status.user);
          } else if (status.kind === 'error') {
            this.cloudManager.removeListener(listener);
            reject(new Error(status.message));
          }
        };
        this.cloudManager.addListener(listener);
        // Reject the promise if the window is closed before cloud status turns authenticated
        window.once('close', () => {
          reject(new Error('Window was closed'));
        });
      } else {
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

    // Open any URLs that the app was not ready to open during startup
    const urlsOpened = this.delayedUrlOpens.map(({ event, urlString }) => {
      // Call the event handler again, now that the app is ready
      return this.onOpenUrl(event, urlString);
    });
    // Wait for all realms to open or show an error on failure
    await Promise.all(urlsOpened).catch(err =>
      showError(`Failed opening URL`, err),
    );
    this.delayedUrlOpens = [];
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

  private onOpenUrl = async (
    event: Event,
    urlString: string,
  ): Promise<void> => {
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
        // Test that any user id matches the currently authenticated user
        const currentUser = raas.user.hasToken()
          ? await raas.user.getAuth()
          : null;
        if (url.username) {
          if (!currentUser) {
            await this.cloudManager.deauthenticate();
            const newUser = await this.showCloudAuthentication(true);
            // Retry
            return this.onOpenUrl(event, urlString);
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
              const newUser = await this.showCloudAuthentication(true);
              // Retry
              return this.onOpenUrl(event, urlString);
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
          type: 'server-administration',
          validateCertificates: true,
        });
      }
    } else {
      this.delayedUrlOpens.push({ event, urlString });
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
    this.registerProtocol(CLOUD_PROTOCOL);
    this.registerProtocol(STUDIO_PROTOCOL);
  }

  private unregisterProtocols() {
    this.unregisterProtocol(CLOUD_PROTOCOL);
    this.unregisterProtocol(STUDIO_PROTOCOL);
  }

  private registerProtocol(protocol: string) {
    // Register this app as the default client for 'x-realm-studio://'
    const success = electron.app.setAsDefaultProtocolClient(protocol);
    if (!success) {
      electron.dialog.showErrorBox(
        'Failed when registering protocols',
        `Studio could not register the ${protocol}:// protocol.`,
      );
    }
  }

  private unregisterProtocol(protocol: string) {
    const success = electron.app.removeAsDefaultProtocolClient(protocol);
    if (!success) {
      electron.dialog.showErrorBox(
        'Failed when unregistering protocols',
        `Studio could not unregister the ${protocol}:// protocol.`,
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
