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

import * as compareVersions from 'compare-versions';
import * as electron from 'electron';
import * as os from 'os';
import * as React from 'react';
import * as Realm from 'realm';
import { URL } from 'url';

import { main } from '../../actions/main';
import { ICloudStatus } from '../../main/CloudManager';
import { dataImporter, ros } from '../../services';
import {
  countdown,
  createPromiseHandle,
  IPromiseHandle,
  menu,
  wait,
} from '../../utils';
import {
  IMenuGenerator,
  IMenuGeneratorProps,
} from '../../windows/MenuGenerator';
import { IServerAdministrationWindowOptions } from '../../windows/WindowOptions';
import { IServerAdministrationWindowProps } from '../../windows/WindowProps';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/RealmLoadingComponent';

import { ServerAdministration, Tab } from './ServerAdministration';

export interface IServerAdministrationContainerProps
  extends IServerAdministrationWindowProps {
  isCloudTenant?: boolean;
}

export interface IServerAdministrationContainerState
  extends IRealmLoadingComponentState {
  activeTab: Tab | null;
  // This will increment when the realm changes to trigger updates to the UI.
  adminRealmChanges: number;
  isCreateRealmOpen: boolean;
  isCreatingRealm: boolean;
  isRealmOpening: boolean;
  serverVersion?: string;
  user: Realm.Sync.User | null;
}

class ServerAdministrationContainer
  extends RealmLoadingComponent<
    IServerAdministrationContainerProps & IMenuGeneratorProps,
    IServerAdministrationContainerState
  >
  implements IMenuGenerator {
  public state: IServerAdministrationContainerState = {
    activeTab: null,
    adminRealmChanges: 0,
    isCreateRealmOpen: false,
    isCreatingRealm: false,
    isRealmOpening: false,
    progress: { status: 'idle' },
    user: null,
  };

  /* A single promise that resolves when the server is available */
  protected availabilityPromise?: Promise<string | undefined>;
  /* A promise handle that gets returned when a user calls createRealm */
  protected createRealmPromiseHandle?: IPromiseHandle<ros.RealmFile>;
  /* A list of object schemas to use when creating the next Realm */
  protected createRealmSchema?: Realm.ObjectSchema[];

  private readonly compatibilityVersions: Array<{
    rosVersion: string;
    studioVersion: string;
  }> = [
    { rosVersion: '2.0.0', studioVersion: '1.19.2-ros2' },
    { rosVersion: '3.11.0', studioVersion: '2.8.2-ros3.10.7' },
  ];

  public async componentDidMount() {
    // Start listening on changes to the cloud-status
    electron.ipcRenderer.on('cloud-status', this.cloudStatusChanged);

    await this.authenticate();
    if (this.props.isCloudTenant) {
      this.setState({
        activeTab: Tab.GettingStarted,
      });
    } else {
      this.setState({
        activeTab: Tab.Realms,
      });
    }
  }

  public async componentWillUpdate(
    nextProps: IServerAdministrationContainerProps,
    nextState: IServerAdministrationContainerState,
  ) {
    if (nextState.user && this.state.user !== nextState.user) {
      this.gotUser(nextState.user);
    }
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'cloud-status',
      this.cloudStatusChanged,
    );
  }

  public render() {
    return (
      <ServerAdministration
        {...this.state}
        {...this}
        adminRealm={this.realm}
        adminRealmChanges={this.state.adminRealmChanges}
        adminRealmProgress={this.state.progress}
        createRealm={this.createRealm}
        isCloudTenant={this.props.isCloudTenant || false}
        isCreateRealmOpen={this.state.isCreateRealmOpen}
        isCreatingRealm={this.state.isCreatingRealm}
        onCancelRealmCreation={this.onCancelRealmCreation}
        onRealmCreation={this.onRealmCreation}
        onValidateCertificatesChange={this.onValidateCertificatesChange}
        validateCertificates={this.props.validateCertificates}
      />
    );
  }

  public generateMenu(template: electron.MenuItemConstructorOptions[]) {
    const importItem: electron.MenuItemConstructorOptions = {
      id: 'import-csv',
      label: 'CSV',
      click: () => this.showImportData(dataImporter.ImportFormat.CSV),
    };
    return menu.performModifications(template, [
      { action: 'replace', id: 'import-csv', items: [importItem] },
    ]);
  }

  // TODO: Once the user serializes better, this method should be moved to the ./realms/RealmsTableContainer.tsx
  public onRealmOpened = async (path: string) => {
    if (!this.state.isRealmOpening) {
      this.setState({ isRealmOpening: true });
      try {
        // Let the UI update before sync waiting on the window to appear
        const realm: ros.realms.ISyncedRealmToLoad = {
          authentication: this.props.credentials,
          mode: ros.realms.RealmLoadingMode.Synced,
          path,
          validateCertificates: this.props.validateCertificates,
        };
        await main.showRealmBrowser({ realm });
      } catch (err) {
        showError('Failed to open Realm', err);
      } finally {
        this.setState({ isRealmOpening: false });
      }
    }
  };

  public onReconnect = async () => {
    // TODO: Use reopen the Realm instead of reloading
    /*
    this.setState({ syncError: undefined });
    this.authenticate();
    */
    await this.ensureServerIsAvailable(this.props.credentials.url);
    location.reload();
  };

  public onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  protected async authenticate() {
    try {
      // Ensure the server is available before authenticating ..
      const version = await this.ensureServerIsAvailable(
        this.props.credentials.url,
      );

      const compatible = this.isCompatibleVersion(version);
      if (!compatible) {
        this.failWithIncompatibleVersion(version);
        return;
      }

      this.setState({
        serverVersion: version,
        progress: {
          status: 'in-progress',
          message: 'Authenticating',
        },
      });
      // Authenticate towards the server
      const user = await ros.users.authenticate(this.props.credentials);
      this.setState({
        progress: {
          status: 'in-progress',
          message: 'Authenticated',
        },
        user,
      });
    } catch (err) {
      const message = this.getAuthenticationErrorMessage(err);
      this.setState({
        progress: {
          status: 'failed',
          message,
          retry: {
            label: 'Retry',
            onRetry: this.onReconnect,
          },
        },
      });
    }
  }

  protected async ensureServerIsAvailable(
    url: string,
  ): Promise<string | undefined> {
    // Return a previous promise if that's available
    if (!this.availabilityPromise) {
      this.availabilityPromise = new Promise(async resolve => {
        while (true) {
          try {
            this.setState({
              progress: {
                status: 'in-progress',
                message: `Checking availability`,
              },
            });
            const availability = await ros.isAvailable(url);
            if (availability.available) {
              // Let's resolve the promise, delete it and break the endless loop
              resolve(availability.version);
              delete this.availabilityPromise;
              return;
            } else {
              throw new Error('Not available ...');
            }
          } catch (err) {
            await wait(500); // Wait to show we're checking ...
            // Errors probably means it's unavailable - let's retry
            await countdown(1000, 3, n => {
              const plural = n >= 1 ? 's' : '';
              this.setState({
                progress: {
                  status: 'in-progress',
                  message: `The server is not available, retrying in ${n} second${plural}`,
                },
              });
            });
          }
        }
      });
    }
    return this.availabilityPromise;
  }

  protected getAuthenticationErrorMessage(err: Error) {
    if (err.message === 'Failed to fetch') {
      return 'Failed to fetch:\nIs the server started?';
    } else {
      return err.message || 'Failed to authenticate';
    }
  }

  protected async gotUser(user: Realm.Sync.User) {
    try {
      this.setState({
        progress: {
          status: 'in-progress',
          message: 'Opening __admin Realm',
        },
      });
      await this.loadRealm({
        authentication: user,
        mode: ros.realms.RealmLoadingMode.Synced,
        path: '__admin',
        validateCertificates: this.props.validateCertificates,
      });
    } catch (err) {
      this.setState({
        progress: {
          status: 'failed',
          message: `Failed to open the __admin Realm: ${err.message}`,
        },
      });
    }
  }

  protected async loadRealm(
    realm: ros.realms.ISyncedRealmToLoad | ros.realms.ILocalRealmToLoad,
  ) {
    if (
      this.certificateWasRejected &&
      realm.mode === 'synced' &&
      !realm.validateCertificates
    ) {
      // TODO: Remove this hack once this Realm JS issue has resolved:
      // https://github.com/realm/realm-js/issues/1469
      this.onValidateCertificatesChange(realm.validateCertificates);
    } else {
      return super.loadRealm(realm);
    }
  }

  protected isCompatibleVersion(version?: string) {
    // Check that version is at least the newest one in the compatibility versions
    const minimumVersion = this.compatibilityVersions[
      this.compatibilityVersions.length - 1
    ].rosVersion;
    return compareVersions(version || '0.0.0', minimumVersion) > -1;
  }

  protected failWithIncompatibleVersion(version?: string) {
    this.setState({
      serverVersion: version,
      progress: {
        status: 'failed',
        message: `You are connecting to an old Realm Object Server,
          no longer supported by Realm Studio.\n
          You can download an older compatible version of Realm Studio,
          which won't receive updates.`,
        retry: {
          label: 'Downgrade Realm Studio',
          onRetry: () => this.onDowngradeStudio(version),
        },
      },
    });
  }

  protected downgradedStudioUrl(version: string | undefined) {
    if (!version) {
      version = '0.0.0';
    }

    let compatibleVersion: string | undefined;
    for (const compatibilityVersion of this.compatibilityVersions) {
      if (compareVersions(version, compatibilityVersion.rosVersion) === -1) {
        compatibleVersion = compatibilityVersion.studioVersion;
        break;
      }
    }

    const baseUrl = `https://studio-releases.realm.io/v${compatibleVersion}`;
    switch (os.platform()) {
      case 'darwin':
        return `${baseUrl}/download/mac-dmg`;
      case 'linux':
        return `${baseUrl}/download/linux-appimage`;
      case 'win32':
        return `${baseUrl}/download/win-setup`;
      default:
        return baseUrl;
    }
  }

  protected async showImportData(format: dataImporter.ImportFormat) {
    try {
      // First create the Realm for the data
      const paths = dataImporter.showOpenDialog(format);
      if (!paths || paths.length === 0) {
        // Don't do anything if the user cancelled or selected no files
        return;
      }
      // Generate a schema from the import files
      const schema = dataImporter.generateSchema(format, paths);
      // Passing the generated schema to createRealm
      const newRealmFile = await this.createRealm(schema);
      // Import the data into the Realm
      const importer = dataImporter.getDataImporter(format, paths, schema);
      if (!this.state.user) {
        throw new Error('Cannot open realm without a user');
      }
      const newRealm = await ros.realms.open(
        this.state.user,
        newRealmFile.path,
        undefined,
        { validateCertificates: this.props.validateCertificates },
      );
      // Import the data
      importer.importInto(newRealm);
      // Open the Realm browser in "import mode"
      const realm: ros.realms.ISyncedRealmToLoad = {
        authentication: this.props.credentials,
        mode: ros.realms.RealmLoadingMode.Synced,
        path: newRealmFile.path,
        validateCertificates: this.props.validateCertificates,
      };
      // Open the newly created realm
      await main.showRealmBrowser({ realm });
    } catch (err) {
      if (err.message === 'Realm creation cancelled') {
        // This is an expected expression to be thrown - no need to show it
        return;
      }
      showError('Failed when importing data', err);
    }
  }

  protected onRealmChanged = () => {
    this.setState({ adminRealmChanges: this.state.adminRealmChanges + 1 });
  };

  protected onRealmLoaded = () => {
    // The child components will be updated from the change of progress state
  };

  protected onSyncError = async (
    session: Realm.Sync.Session,
    error: Realm.Sync.SyncError,
  ) => {
    if (error.message === 'SSL server certificate rejected') {
      this.certificateWasRejected = true;
      this.setState({
        progress: {
          status: 'failed',
          message: 'The servers certificate could not be trusted',
          retry: {
            label: 'Reconnect, trusting the certificate',
            onRetry: () => {
              this.onValidateCertificatesChange(false);
            },
          },
        },
      });
    } else if (error.isFatal === false) {
      /* tslint:disable-next-line:no-console */
      console.warn(`A non-fatal sync error happened: ${error.message}`, error);
    } else {
      this.setState({
        progress: {
          status: 'failed',
          message: error.message,
          retry: {
            label: 'Reconnect',
            onRetry: this.onReconnect,
          },
        },
      });
    }
  };

  protected cloudStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: ICloudStatus,
  ) => {
    // If the user is deauthenticated - close the window if it's administering a cloud tenant
    if (this.props.isCloudTenant && status.kind === 'not-authenticated') {
      electron.remote.getCurrentWindow().close();
    }
  };

  protected onDowngradeStudio = (version: string | undefined) => {
    const url = this.downgradedStudioUrl(version);
    electron.remote.shell.openExternal(url);
    window.close();
  };

  protected onValidateCertificatesChange = (validateCertificates: boolean) => {
    const url = new URL(location.href);
    // Get the options
    const windowOptions: IServerAdministrationWindowOptions = JSON.parse(
      url.searchParams.get('options') || '{}',
    );
    // Update the options
    windowOptions.props.validateCertificates = validateCertificates;
    // Set the options
    url.searchParams.set('options', JSON.stringify(windowOptions));
    // Change location to update the props
    // This is needed because Realm JS cannot reconfigure the sync session
    // @see https://github.com/realm/realm-js/issues/1469
    location.replace(url.toString());
  };

  protected onRealmCreation = async (path: string) => {
    try {
      this.setState({ isCreatingRealm: true });
      if (this.realm && this.state.user) {
        const serverPath = this.guessServerPath(path);
        // Check if the Realm already exists
        const existingRealmFile = this.realm.objectForPrimaryKey(
          'RealmFile',
          serverPath,
        );
        if (existingRealmFile) {
          throw new Error('Another Realm with this path already exists');
        }
        // Create a new Realm at the path specificed by the user
        const newRealm = await ros.realms.create(
          this.state.user,
          path,
          this.createRealmSchema,
        );
        // Close the Realm - we don't need it open anymore
        newRealm.close();
        // If we are waiting for the realm to be created - hang on to the path
        if (this.createRealmPromiseHandle) {
          // Because we awaited creation - the admin Realm has most probably synced already
          const newRealmFile = this.realm.objectForPrimaryKey<ros.RealmFile>(
            'RealmFile',
            serverPath,
          );
          // If the file was available - resolve the create realm promise
          if (newRealmFile) {
            this.createRealmPromiseHandle.resolve(newRealmFile);
          } else {
            throw new Error(`Could not find Realm at '${serverPath}'`);
          }
        }
      }
    } catch (err) {
      if (this.createRealmPromiseHandle) {
        this.createRealmPromiseHandle.reject(err);
      } else {
        // Rethrow
        throw err;
      }
    } finally {
      this.setState({ isCreatingRealm: false });
    }
  };

  protected guessServerPath(path: string): string {
    if (path.indexOf('/') !== 0) {
      // Prepend a slash
      path = `/${path}`;
    }
    // Replace the ~ with the user id
    if (this.state.user) {
      path = path.replace('~', this.state.user.identity);
    }
    return path;
  }

  // TODO: Move this into the CreateRealmDialog
  protected createRealm = (schema?: Realm.ObjectSchema[]) => {
    if (this.createRealmPromiseHandle) {
      throw new Error('You can only create one Realm at a time');
    } else {
      this.setState({ isCreateRealmOpen: true });
      this.createRealmSchema = schema;
      this.createRealmPromiseHandle = createPromiseHandle();
      return this.createRealmPromiseHandle.promise.then(
        realmFile => {
          delete this.createRealmPromiseHandle;
          delete this.createRealmSchema;
          this.setState({ isCreateRealmOpen: false });
          return realmFile;
        },
        reason => {
          delete this.createRealmPromiseHandle;
          delete this.createRealmSchema;
          this.setState({ isCreateRealmOpen: false });
          throw reason;
        },
      );
    }
  };

  protected onCancelRealmCreation = async () => {
    if (this.state.isCreateRealmOpen && this.createRealmPromiseHandle) {
      const err = new Error('Realm creation cancelled');
      this.createRealmPromiseHandle.reject(err);
    } else {
      this.setState({ isCreateRealmOpen: false });
    }
  };
}

export { ServerAdministrationContainer as ServerAdministration };
