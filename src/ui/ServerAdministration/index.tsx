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

import electron from 'electron';
import os from 'os';
import React from 'react';
import Realm from 'realm';
import semver from 'semver';
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
import { ISyncedRealmToLoad, RealmLoadingMode } from '../../utils/realms';
import {
  IMenuGenerator,
  IMenuGeneratorProps,
} from '../../windows/MenuGenerator';
import { IServerAdministrationWindowOptions } from '../../windows/WindowOptions';
import { IServerAdministrationWindowProps } from '../../windows/WindowProps';
import { ILoadingProgress } from '../reusable';
import { showError } from '../reusable/errors';

import {
  AdminRealmConsumer,
  AdminRealmProvider,
  getAdminRealmConfig,
} from './AdminRealm';
import { ServerAdministration, Tab } from './ServerAdministration';

const DONT_SHOW_PARTIAL_WARNING_KEY = 'dont-show-partial-warning';

export type IServerAdministrationContainerProps = IServerAdministrationWindowProps;

export interface IServerAdministrationContainerState {
  activeTab: Tab | null;
  isCreateRealmOpen: boolean;
  isCreatingRealm: boolean;
  isRealmOpening: boolean;
  serverVersion?: string;
  user: Realm.Sync.User | null;
  progress: ILoadingProgress;
}

class ServerAdministrationContainer
  extends React.Component<
    IServerAdministrationContainerProps & IMenuGeneratorProps,
    IServerAdministrationContainerState
  >
  implements IMenuGenerator {
  public state: IServerAdministrationContainerState = {
    activeTab: null,
    isCreateRealmOpen: false,
    isCreatingRealm: false,
    isRealmOpening: false,
    progress: {
      status: 'in-progress',
      message: 'Loading',
    },
    user: null,
  };

  /* A single promise that resolves when the server is available */
  private availabilityPromise?: Promise<string | undefined>;
  /* A promise handle that gets returned when a user calls createRealm */
  private createRealmPromiseHandle?: IPromiseHandle<ros.RealmFile>;
  /* A list of object schemas to use when creating the next Realm */
  private createRealmSchema?: Realm.ObjectSchema[];
  /* The admin Realm */
  private adminRealm?: Realm;

  /**
   * An array of pairs of ROS + Studio versions which are compatible,
   * for every element, the rosVersion is the first version which is incompatible with a particular version of Studio,
   * in which case the studioVersion is the latest version compatible with the server in question.
   * The array is ordered, such that newer incompatibilities must be added to the end.
   */
  private readonly compatibilityVersions: {
    rosVersion: string;
    studioVersion: string;
  }[] = [
    { rosVersion: '3.0.0', studioVersion: '1.19.2-ros2' },
    { rosVersion: '3.11.0', studioVersion: '2.9.1-ros3.10.7' },
    { rosVersion: '3.20.1', studioVersion: '3.8.1-ros-3-19-0' },
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

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'cloud-status',
      this.cloudStatusChanged,
    );
  }

  public render() {
    const { user } = this.state;
    const { validateCertificates } = this.props;
    if (user) {
      const config = getAdminRealmConfig(user, {
        error: this.onSyncError,
        ssl: { validate: validateCertificates },
      });
      return (
        <AdminRealmProvider {...config}>
          {this.renderServerAdministration()}
          <AdminRealmConsumer>{this.onAdminRealm}</AdminRealmConsumer>
        </AdminRealmProvider>
      );
    } else {
      return this.renderServerAdministration();
    }
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

  private renderServerAdministration() {
    return (
      <ServerAdministration
        activeTab={this.state.activeTab}
        createRealm={this.createRealm}
        isCloudTenant={this.props.isCloudTenant || false}
        isCreateRealmOpen={this.state.isCreateRealmOpen}
        isCreatingRealm={this.state.isCreatingRealm}
        isRealmOpening={this.state.isRealmOpening}
        onCancelRealmCreation={this.onCancelRealmCreation}
        onRealmCreation={this.onRealmCreation}
        onRealmOpened={this.onRealmOpened}
        onReconnect={this.onReconnect}
        onTabChanged={this.onTabChanged}
        progress={this.state.progress}
        serverVersion={this.state.serverVersion}
        user={this.state.user}
      />
    );
  }

  // TODO: Once the user serializes better, this method should be moved to the ./realms/RealmsTableContainer.tsx
  private onRealmOpened = async (path: string, usingGrahpiql = false) => {
    if (!this.state.isRealmOpening && this.adminRealm) {
      this.setState({ isRealmOpening: true });
      try {
        if (usingGrahpiql) {
          await main.showGraphiqlEditor({
            user: this.props.user,
            path,
          });
        } else {
          const realm: ISyncedRealmToLoad = {
            user: this.props.user,
            mode: RealmLoadingMode.Synced,
            path,
            validateCertificates: this.props.validateCertificates,
          };
          const realmFile = this.adminRealm.objectForPrimaryKey<ros.RealmFile>(
            'RealmFile',
            path,
          );
          if (realmFile) {
            if (realmFile.realmType === 'partial') {
              await this.showPartialRealmWarning();
              await main.showRealmBrowser({ realm, readOnly: true });
            } else {
              await main.showRealmBrowser({ realm });
            }
          } else {
            throw new Error("Couldn't find the Realm in the /__admin Realm");
          }
        }
      } catch (err) {
        showError('Failed to open Realm', err);
      } finally {
        this.setState({ isRealmOpening: false });
      }
    }
  };

  private onReconnect = async () => {
    // TODO: Use reopen the Realm instead of reloading
    /*
    this.authenticate();
    */
    await this.ensureServerIsAvailable(this.props.user.server);
    location.reload();
  };

  private onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
  };

  private async ensureServerIsAvailable(
    url: string,
  ): Promise<string | undefined> {
    // Return a previous promise if that's available
    if (!this.availabilityPromise) {
      this.availabilityPromise = new Promise(async resolve => {
        let availability: ros.Availability | undefined;
        while (!availability || !availability.available) {
          this.setState({
            progress: {
              status: 'in-progress',
              message: `Checking availability`,
            },
          });
          availability = await ros.isAvailable(url);
          if (!availability.available) {
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

        resolve(availability.version);
        delete this.availabilityPromise;
      });
    }
    return this.availabilityPromise;
  }

  private isCompatibleVersion(version?: string) {
    // Check that version is at least the newest one in the compatibility versions
    const minimumVersion = this.compatibilityVersions[
      this.compatibilityVersions.length - 1
    ].rosVersion;
    return semver.gte(version || '0.0.0', minimumVersion);
  }

  private downgradedStudioUrl(version: string = '0.0.0') {
    let compatibleVersion: string | undefined;
    // Find the Studio version compatible with the first incompatibility with the servers version.
    for (const compatibilityVersion of this.compatibilityVersions) {
      if (semver.lt(version, compatibilityVersion.rosVersion)) {
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

  private async showImportData(format: dataImporter.ImportFormat) {
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
      if (!this.state.user) {
        throw new Error('Cannot open realm without a user');
      }
      // Open the Realm browser in "import mode"
      await main.showRealmBrowser({
        realm: {
          user: this.props.user,
          mode: RealmLoadingMode.Synced,
          path: newRealmFile.path,
          validateCertificates: this.props.validateCertificates,
        },
        import: {
          format,
          paths,
          schema,
        },
      });
    } catch (err) {
      if (err.message === 'Realm creation cancelled') {
        // This is an expected expression to be thrown - no need to show it
        return;
      }
      showError('Failed when importing data', err);
    }
  }

  private async showPartialRealmWarning() {
    const show = localStorage.getItem(DONT_SHOW_PARTIAL_WARNING_KEY) !== 'true';
    if (show) {
      return new Promise(resolve => {
        electron.remote.dialog.showMessageBox(
          electron.remote.getCurrentWindow(),
          {
            message:
              'You are opening a partial Realm created for a specific client. You can only browse the content in read-only mode.',
            checkboxLabel: 'Don´t show this again',
            buttons: ['Open as read-only'],
          },
          (_, checkboxChecked) => {
            if (checkboxChecked) {
              localStorage.setItem(DONT_SHOW_PARTIAL_WARNING_KEY, 'true');
            }
            resolve();
          },
        );
      });
    }
  }

  private onAdminRealm = ({ realm }: { realm: Realm }) => {
    this.adminRealm = realm;
    return null;
  };

  private onSyncError = async (
    session: Realm.Sync.Session,
    error: Realm.Sync.SyncError,
  ) => {
    if (error.message === 'SSL server certificate rejected') {
      // this.certificateWasRejected = true;
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
      // tslint:disable-next-line:no-console
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

  private cloudStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: ICloudStatus,
  ) => {
    // If the user is deauthenticated - close the window if it's administering a cloud tenant
    if (this.props.isCloudTenant && status.kind === 'not-authenticated') {
      electron.remote.getCurrentWindow().close();
    }
  };

  private onDowngradeStudio = (version: string | undefined) => {
    const url = this.downgradedStudioUrl(version);
    electron.remote.shell.openExternal(url);
    window.close();
  };

  private onValidateCertificatesChange = (validateCertificates: boolean) => {
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

  private onRealmCreation = async (path: string) => {
    try {
      this.setState({ isCreatingRealm: true });
      const { user } = this.state;
      if (this.adminRealm && user) {
        const serverPath = this.guessServerPath(path);
        // Check if the Realm already exists
        const existingRealmFile = this.adminRealm.objectForPrimaryKey(
          'RealmFile',
          serverPath,
        );
        if (existingRealmFile) {
          throw new Error('Another Realm with this path already exists');
        }
        // Create a new Realm at the path specificed by the user
        const newRealm = await ros.realms.create(
          user,
          path,
          this.createRealmSchema,
          this.props.validateCertificates,
        );
        // Close the Realm - we don't need it open anymore
        newRealm.close();
        // If we are waiting for the realm to be created - hang on to the path
        if (this.createRealmPromiseHandle) {
          // Because we awaited creation - the admin Realm has most probably synced already
          const newRealmFile = this.adminRealm.objectForPrimaryKey<
            ros.RealmFile
          >('RealmFile', serverPath);
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

  private guessServerPath(path: string): string {
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
  private createRealm = (schema?: Realm.ObjectSchema[]) => {
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

  private onCancelRealmCreation = async () => {
    if (this.state.isCreateRealmOpen && this.createRealmPromiseHandle) {
      const err = new Error('Realm creation cancelled');
      this.createRealmPromiseHandle.reject(err);
    } else {
      this.setState({ isCreateRealmOpen: false });
    }
  };

  private async authenticate() {
    // Ensure the server is available and its version is compatible ..
    const version = await this.ensureServerIsAvailable(this.props.user.server);
    const compatible = this.isCompatibleVersion(version);
    if (!compatible) {
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
    } else {
      const user = Realm.Sync.User.deserialize(this.props.user);
      this.setState({
        serverVersion: version,
        progress: {
          status: 'done',
          message: `Authenticated`,
        },
        user,
      });
    }
  }
}

export { ServerAdministrationContainer as ServerAdministration };
