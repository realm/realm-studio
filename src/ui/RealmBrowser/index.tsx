////////////////////////////////////////////////////////////////////////////
//
// Copyright 2019 Realm Inc.
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

import { ipcRenderer, MenuItemConstructorOptions, remote } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import React from 'react';
import { RealmConsumer, RealmProvider } from 'react-realm-context';
import Realm from 'realm';

import { DataExporter, DataExportFormat } from '../../services/data-exporter';
import * as dataImporter from '../../services/data-importer';
import { Language, SchemaExporter } from '../../services/schema-export';
import { menu, realms } from '../../utils';
import {
  IMenuGenerator,
  IMenuGeneratorProps,
} from '../../windows/MenuGenerator';
import { IRealmBrowserWindowProps } from '../../windows/WindowProps';
import { ILoadingProgress } from '../reusable';
import { showError } from '../reusable/errors';

import { Content, EditMode } from './Content';
import { Focus, generateKey, IClassFocus, IListFocus } from './focus';
import { isPrimitive } from './primitives';
import { RealmBrowser } from './RealmBrowser';
import * as schemaUtils from './schema-utils';

// TODO: Remove this interface once the Realm.ObjectSchemaProperty
// has a name parameter in its type definition.
export interface IPropertyWithName extends Realm.ObjectSchemaProperty {
  name: string | null;
  readOnly: boolean;
  isPrimaryKey: boolean;
}

export type EditModeChangeHandler = (editMode: EditMode) => void;
export type ListFocussedHandler = (
  object: Realm.Object,
  property: IPropertyWithName,
  highlightedObject?: Realm.Object,
) => void;
export type ClassFocussedHandler = (
  className: string,
  highlightedObject?: Realm.Object,
) => void;

const EDIT_MODE_STORAGE_KEY = 'realm-browser-edit-mode';
const FILE_UPGRADE_NEEDED_MESSAGE =
  'The Realm file format must be allowed to be upgraded in order to proceed.';

export interface IRealmBrowserState {
  // A number that we can use to make components update on changes to data
  dataVersion: number;
  dataVersionAtBeginning?: number;
  editMode: EditMode;
  focus: Focus | null;
  isAddClassOpen: boolean;
  isAddPropertyOpen: boolean;
  isEncryptionDialogVisible: boolean;
  isLeftSidebarOpen: boolean;
  // The classes are only supposed to be used to produce a list of classes in the sidebar
  classes: Realm.ObjectSchema[];
  importProgress: ILoadingProgress;
}

class RealmBrowserContainer
  extends React.Component<
    IRealmBrowserWindowProps & IMenuGeneratorProps,
    IRealmBrowserState
  >
  implements IMenuGenerator {
  public state: IRealmBrowserState = {
    dataVersion: 0,
    editMode:
      (localStorage.getItem(EDIT_MODE_STORAGE_KEY) as EditMode) ||
      EditMode.InputBlur,
    focus: null,
    isAddClassOpen: false,
    isAddPropertyOpen: false,
    isEncryptionDialogVisible: false,
    isLeftSidebarOpen: true,
    importProgress: { status: 'idle' },
    classes: [],
  };

  private contentInstance: Content | null = null;
  private realm: Realm | null = null;

  public componentDidMount() {
    /*
    this.loadRealm(
      this.props.realm,
      this.props.import ? this.props.import.schema : undefined,
    );
    */
    this.addListeners();
  }

  public componentWillUnmount() {
    this.removeListeners();
    if (this.realm && this.realm.isInTransaction) {
      this.realm.cancelTransaction();
    }
  }

  public render() {
    const { focus } = this.state;
    // Generating a key for the content component (includes length of properties to update when the schema changes)
    const contentKey = generateKey(focus, true);
    const realmConfig: Realm.PartialConfiguration = this.generateRealmConfig();
    return (
      <RealmProvider {...realmConfig}>
        <RealmConsumer>
          {({ realm }) => {
            if (this.realm !== realm) {
              this.realm = realm;
              // Waiting for the next tick to prevent setState from being called while rendering
              process.nextTick(this.onRealmOpened);
            }
            return (
              <RealmBrowser
                classes={realm.schema}
                contentKey={contentKey}
                contentRef={this.contentRef}
                dataVersion={this.state.dataVersion}
                dataVersionAtBeginning={this.state.dataVersionAtBeginning}
                editMode={
                  this.props.readOnly ? EditMode.Disabled : this.state.editMode
                }
                focus={this.state.focus}
                getClassFocus={this.getClassFocus}
                getSchemaLength={this.getSchemaLength}
                isAddClassOpen={this.state.isAddClassOpen}
                isAddPropertyOpen={this.state.isAddPropertyOpen}
                isClassNameAvailable={this.isClassNameAvailable}
                isEncryptionDialogVisible={this.state.isEncryptionDialogVisible}
                isLeftSidebarOpen={this.state.isLeftSidebarOpen}
                isPropertyNameAvailable={this.isPropertyNameAvailable}
                onAddClass={this.onAddClass}
                onAddProperty={this.onAddProperty}
                onCancelTransaction={this.onCancelTransaction}
                onClassFocussed={this.onClassFocussed}
                onCommitTransaction={this.onCommitTransaction}
                onHideEncryptionDialog={this.onHideEncryptionDialog}
                onLeftSidebarToggle={this.onLeftSidebarToggle}
                onListFocussed={this.onListFocussed}
                onOpenWithEncryption={this.onOpenWithEncryption}
                onRealmChange={this.onRealmChange}
                realm={realm}
                toggleAddClass={this.toggleAddClass}
                toggleAddClassProperty={this.toggleAddClassProperty}
                importProgress={this.state.importProgress}
              />
            );
          }}
        </RealmConsumer>
      </RealmProvider>
    );
  }

  public generateMenu(template: MenuItemConstructorOptions[]) {
    const importMenu: MenuItemConstructorOptions = {
      label: 'Import data from',
      submenu: [
        {
          label: 'CSV',
          click: () => this.onImportIntoExistingRealm(),
        },
      ],
    };

    const exportSchemaMenu: MenuItemConstructorOptions = {
      label: 'Save model definitions',
      submenu: [
        {
          label: 'Swift',
          click: () => this.onExportSchema(Language.Swift),
        },
        {
          label: 'JavaScript',
          click: () => this.onExportSchema(Language.JS),
        },
        {
          label: 'TypeScript',
          click: () => this.onExportSchema(Language.TS),
        },
        {
          label: 'Java',
          click: () => this.onExportSchema(Language.Java),
        },
        {
          label: 'Kotlin',
          click: () => this.onExportSchema(Language.Kotlin),
        },
        {
          label: 'C#',
          click: () => this.onExportSchema(Language.CS),
        },
      ],
    };

    const exportDataMenu: MenuItemConstructorOptions = {
      label: 'Save data',
      submenu: [
        {
          label: 'JSON',
          click: () => this.onExportData(DataExportFormat.JSON),
        },
        {
          label: 'Local Realm',
          click: () => this.onExportData(DataExportFormat.LocalRealm),
        },
      ],
    };

    const clearCacheMenuItem: MenuItemConstructorOptions = {
      id: 'clear-cached-realm',
      label: 'Clear cached Realm',
      click: this.onClearCachedRealm,
    };

    const transactionMenuItems: MenuItemConstructorOptions[] =
      this.realm && this.realm.isInTransaction
        ? [
            {
              label: 'Commit transaction',
              accelerator: 'CommandOrControl+T',
              click: () => {
                this.onCommitTransaction();
              },
            },
            {
              label: 'Cancel transaction',
              accelerator: 'CommandOrControl+Shift+T',
              click: () => {
                this.onCancelTransaction();
              },
            },
          ]
        : [
            {
              label: 'Begin transaction',
              accelerator: 'CommandOrControl+T',
              click: () => {
                this.onBeginTransaction();
              },
            },
          ];

    const editModeMenu: MenuItemConstructorOptions = {
      label: 'Edit mode',
      submenu: [
        {
          label: 'Update when leaving a field',
          type: 'radio',
          checked: this.state.editMode === EditMode.InputBlur,
          click: () => {
            this.onEditModeChange(EditMode.InputBlur);
          },
        },
        {
          label: 'Update on key press',
          type: 'radio',
          checked: this.state.editMode === EditMode.KeyPress,
          click: () => {
            this.onEditModeChange(EditMode.KeyPress);
          },
        },
      ],
    };

    const copyRealmPathItem: MenuItemConstructorOptions = {
      label: 'Copy local Realm path',
      click: () => {
        this.copyRealmPathToClipboard().then(null, err => {
          showError('Failed to copy Realm path', err);
        });
      },
    };

    return menu.performModifications(template, [
      {
        action: 'append',
        id: 'import',
        items: [importMenu],
      },
      {
        action: 'prepend',
        id: 'close',
        items: [
          exportSchemaMenu,
          exportDataMenu,
          copyRealmPathItem,
          clearCacheMenuItem,
          { type: 'separator' },
        ],
      },
      {
        action: 'append',
        id: 'select-all',
        items: [{ type: 'separator' }, ...transactionMenuItems, editModeMenu],
      },
    ]);
  }

  /*
  // TODO: Fix opening encrypted Realms
  protected loadingRealmFailed(err: Error) {
    const message = err.message || '';
    const mightBeEncrypted =
      message.indexOf('Not a Realm file.') >= 0 ||
      message.indexOf('Invalid mnemonic') >= 0;
    const realm = this.props.realm;
    if (mightBeEncrypted) {
      this.setState({
        isEncryptionDialogVisible: true,
        progress: {
          status: 'done',
        },
      });
    } else if (
      message === FILE_UPGRADE_NEEDED_MESSAGE &&
      realm.mode === realms.RealmLoadingMode.Local
    ) {
      const buttons = ['Cancel', 'Upgrade in-place', 'Backup and upgrade'];
      const answerIndex = remote.dialog.showMessageBoxSync({
        type: 'question',
        buttons,
        defaultId: 2,
        title: 'Realm file needs an upgrade',
        message: 'The Realm file stores data in an outdated format',
        detail:
          'This file needs to be upgraded to a newer file format before it can be opened. Would you like a backup of the file, before performing an irreversible upgrade of the file?',
      });
      const answer = buttons[answerIndex];

      if (answer === 'Upgrade in-place' || answer === 'Backup and upgrade') {
        try {
          if (answer === 'Backup and upgrade') {
            // Create a backup first
            const backupDirectory = path.dirname(realm.path);
            const backupFileName = path.basename(realm.path, '.realm');
            const backupPath = path.resolve(
              backupDirectory,
              backupFileName + '.backup.realm',
            );
            // Copy, but ensure we don't override an existing file
            fs.copyFileSync(realm.path, backupPath, fs.constants.COPYFILE_EXCL);
            remote.dialog.showMessageBox({
              title: 'Backup saved',
              message: 'The backup Realm file was saved to:',
              detail: backupPath,
            });
          }
          // Reopen, enabling format upgrades an upgrade
          this.loadRealm({
            ...realm,
            enableFormatUpgrade: true,
          });
        } catch (err) {
          showError('Failed upgrading Realm', err);
          window.close();
        }
      } else {
        window.close();
      }
    } else {
      delete this.props.realm.encryptionKey;
      super.loadingRealmFailed(err);
    }
  }
  */

  protected onRealmChange = () => {
    this.setState({ dataVersion: this.state.dataVersion + 1 });
  };

  protected onRealmOpened = () => {
    if (!this.realm) {
      throw new Error('onRealmOpened was called without a realm sat');
    }
    if (this.props.readOnly) {
      // Monkey-patch the write function to ensure no-one writes to the Realm
      this.realm.write = () => {
        throw new Error('Realm was opened as read-only');
      };
    }
    this.realm.addListener('schema', this.onSchemaChange);
    this.realm.addListener('change', this.onRealmChange);
    // Fire the schema change initially
    this.onSchemaChange();
    // Start importing data if needed
    this.performImport();
  };

  private generateRealmConfig(): Realm.PartialConfiguration {
    const { realm } = this.props;
    if (realm.mode === 'local') {
      return {
        path: realm.path,
        encryptionKey: realm.encryptionKey,
        // It's undocumented, but sync can indeed take a boolean allowing it to open local Realms with sync history.
        sync: (realm.sync as any) as Realm.Sync.SyncConfiguration,
      };
    } else if (realm.mode === 'synced') {
      const user = Realm.Sync.User.deserialize(realm.user);
      // TODO: Handle realm.validateCertificates
      return user.createConfiguration({
        encryptionKey: realm.encryptionKey,
        sync: {
          url: realm.path,
          _disableQueryBasedSyncUrlChecks: true,
          fullSynchronization: true,
        },
      });
    } else {
      throw new Error(`Unsupported mode ${realm.mode}`);
    }
  }

  private onBeginTransaction = () => {
    if (this.realm && !this.realm.isInTransaction) {
      this.realm.beginTransaction();
      // Ask the menu to update
      this.props.updateMenu();
      // Hang on to the dataVersion
      this.setState({
        dataVersionAtBeginning: this.state.dataVersion,
      });
    } else {
      throw new Error(`Realm is not ready or already in transaction`);
    }
  };

  private onCommitTransaction = () => {
    if (this.realm && this.realm.isInTransaction) {
      this.realm.commitTransaction();
      this.props.updateMenu();
      this.resetDataVersion();
    } else {
      throw new Error('Cannot commit when not in a transaction');
    }
  };

  private onCancelTransaction = () => {
    if (this.realm && this.realm.isInTransaction) {
      this.realm.cancelTransaction();
      this.props.updateMenu();
      this.resetDataVersion();
    } else {
      throw new Error('Cannot cancel when not in a transaction');
    }
  };

  private onClearCachedRealm = () => {
    if (this.realm) {
      const config = this.generateRealmConfig();
      this.realm.close();
      Realm.deleteFile(config);
      location.reload();
    }
  };

  private isClassNameAvailable = (name: string): boolean => {
    return !this.state.classes.find(schema => schema.name === name);
  };

  private toggleAddClass = () => {
    this.setState({
      isAddClassOpen: !this.state.isAddClassOpen,
    });
  };

  private isPropertyNameAvailable = (name: string): boolean => {
    return (
      this.state.focus !== null &&
      !this.state.focus.properties.find(property => property.name === name)
    );
  };

  private toggleAddClassProperty = () => {
    this.setState({
      isAddPropertyOpen: !this.state.isAddPropertyOpen,
    });
  };

  private onAddClass = async (schema: Realm.ObjectSchema) => {
    const realm = this.realm;
    if (realm) {
      try {
        realm.write(() => {
          // Update the schema using an undocumented API
          realm._updateSchema([...realm.schema, schema]);
        });
        // Select the schema when it the realm has loaded
        this.onClassFocussed(schema.name);
      } catch (err) {
        showError(`Failed creating the model "${schema.name}"`, err);
      }
    }
  };

  private onAddProperty = async (name: string, type: Realm.PropertyType) => {
    const realm = this.realm;
    if (realm && this.state.focus && this.state.focus.kind === 'class') {
      try {
        const focusedClassName = this.state.focus.className;
        const modifiedSchema = schemaUtils.addProperty(
          realm.schema,
          focusedClassName,
          name,
          type,
        );

        realm.write(() => {
          realm._updateSchema(modifiedSchema);
          // Ensure we've selected the class that we've just added a property to
          this.onClassFocussed(focusedClassName);
        });
      } catch (err) {
        showError(
          `Failed adding the property named "${name}" to the selected schema`,
          err,
        );
      }
    }
  };

  private changeFocusIfAllowed(focus: Focus, highligtedObject?: Realm.Object) {
    const canChangeFocus = this.canChangeFocus();
    if (canChangeFocus) {
      this.setState({ focus }, () => {
        if (highligtedObject && this.contentInstance) {
          this.contentInstance.highlightObject(highligtedObject);
        }
      });
    }
  }

  private onClassFocussed: ClassFocussedHandler = (
    className,
    highlightedObject,
  ) => {
    const focus = this.getClassFocus(className);
    this.changeFocusIfAllowed(focus, highlightedObject);
  };

  private onListFocussed: ListFocussedHandler = (
    object: Realm.Object,
    property: IPropertyWithName,
    highlightedObject?: Realm.Object,
  ) => {
    const focus = this.getListFocus(object, property);
    this.changeFocusIfAllowed(focus, highlightedObject);
  };

  private getClassFocus = (className: string): IClassFocus => {
    if (this.realm) {
      const results = this.realm.objects(className);
      return {
        kind: 'class',
        className,
        results,
        properties: this.derivePropertiesFromClassName(className),
      };
    } else {
      throw new Error('getClassFocus called before realm was loaded');
    }
  };

  private getListFocus = (
    // `{ [name: string]: any }` because of Realm JS types
    object: Realm.Object & { [name: string]: any },
    property: IPropertyWithName,
  ): IListFocus => {
    if (property.name) {
      const common = {
        parent: object,
        property,
        properties: this.derivePropertiesFromProperty(property),
        results: object[property.name],
      };
      if (property.objectType && isPrimitive(property.objectType)) {
        return {
          ...common,
          kind: 'list',
          ofPrimitives: true,
        };
      } else {
        return {
          ...common,
          kind: 'list',
          ofPrimitives: false,
        };
      }
    } else {
      throw new Error('Expected a property with a name property');
    }
  };

  private getSchemaLength = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  };

  private onEditModeChange: EditModeChangeHandler = editMode => {
    localStorage.setItem(EDIT_MODE_STORAGE_KEY, editMode);
    this.setState({ editMode });
  };

  private onHideEncryptionDialog = () => {
    this.setState({ isEncryptionDialogVisible: false });
  };

  private onLeftSidebarToggle = () => {
    this.setState({ isLeftSidebarOpen: !this.state.isLeftSidebarOpen });
  };

  private onOpenWithEncryption = (key: string) => {
    this.props.realm.encryptionKey = Buffer.from(key, 'hex');
    // TODO: Fix opening Realms with encryption.
    throw new Error('Not implemented');
    // this.loadRealm(this.props.realm);
  };

  private onBeforeUnload = (e: BeforeUnloadEvent) => {
    if (this.realm && this.realm.isInTransaction) {
      e.returnValue = false;

      const { dataVersionAtBeginning, dataVersion } = this.state;
      const unsavedChanges =
        typeof dataVersionAtBeginning === 'number'
          ? dataVersion - dataVersionAtBeginning
          : 0;
      // Show a dialog
      const currentWindow = remote.getCurrentWindow();
      const plural = unsavedChanges > 1 ? 's' : '';
      remote.dialog
        .showMessageBox(currentWindow, {
          type: 'warning',
          message: `You have ${unsavedChanges} unsaved change${plural}`,
          buttons: ['Save and close', 'Discard and close', 'Cancel'],
        })
        .then(({ response }) => {
          if (response === 0 || response === 1) {
            if (response === 0) {
              this.onCommitTransaction();
            } else if (response === 1) {
              this.onCancelTransaction();
            }
            // Allow the for the state to update
            process.nextTick(() => {
              window.close();
            });
          }
        });
    }
  };

  private addListeners() {
    ipcRenderer.addListener('export-schema', this.onExportSchema);
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  private removeListeners() {
    ipcRenderer.removeListener('export-schema', this.onExportSchema);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    if (this.realm) {
      this.realm.removeListener('schema', this.onSchemaChange);
      this.realm.removeListener('change', this.onRealmChange);
    }
  }

  private derivePropertiesFromProperty(
    property: IPropertyWithName,
  ): IPropertyWithName[] {
    // Determine the properties
    if (property.type === 'list' && property.objectType) {
      const properties: IPropertyWithName[] = [
        { name: '#', type: 'int', readOnly: true, isPrimaryKey: false },
      ];
      if (isPrimitive(property.objectType)) {
        return properties.concat([
          {
            name: null,
            type: property.objectType,
            readOnly: false,
            isPrimaryKey: false,
          },
        ]);
      } else {
        return properties.concat(
          this.derivePropertiesFromClassName(property.objectType),
        );
      }
    } else {
      throw new Error(`Expected a list property with an objectType`);
    }
  }

  private derivePropertiesFromClassName(
    className: string,
  ): IPropertyWithName[] {
    if (!this.realm) {
      throw new Error(
        'derivePropertiesFromClassName called before realm was loaded',
      );
    }
    // Deriving the ObjectSchema from the className
    const objectSchema = this.realm.schema.find(schema => {
      return schema.name === className;
    });
    if (!objectSchema) {
      throw new Error(`Found no object schema named '${className}'`);
    }
    // Derive the properties from the objectSchema
    return Object.keys(objectSchema.properties).map(propertyName => {
      const property = objectSchema.properties[propertyName];
      if (typeof property === 'object') {
        return {
          name: propertyName,
          readOnly: false,
          isPrimaryKey: objectSchema.primaryKey === propertyName,
          ...property,
        };
      } else {
        throw new Error(`Object schema had a string describing its property`);
      }
    });
  }

  private resetDataVersion() {
    if (typeof this.state.dataVersionAtBeginning === 'number') {
      this.setState({
        dataVersion: this.state.dataVersionAtBeginning,
        dataVersionAtBeginning: undefined,
      });
    }
  }

  private canChangeFocus() {
    if (this.contentInstance) {
      const { latestCellValidation } = this.contentInstance;
      return !latestCellValidation || latestCellValidation.valid;
    } else {
      return true;
    }
  }

  private contentRef = (instance: Content | null) => {
    this.contentInstance = instance;
  };

  private onExportSchema = (language: Language): void => {
    const basename = path.basename(this.props.realm.path, '.realm');
    const selectedPath = remote.dialog.showSaveDialogSync({
      defaultPath: `${basename}-classes`,
      message: `Select a directory to store the ${language} schema files`,
    });
    if (selectedPath && this.realm) {
      const exporter = SchemaExporter(language);
      exporter.exportSchema(this.realm);
      exporter.writeFilesToDisk(selectedPath);
    }
  };

  private onExportData = (format: DataExportFormat) => {
    try {
      const exporter = new DataExporter(format);
      if (this.realm) {
        const destinationPath = remote.dialog.showSaveDialogSync({
          defaultPath: exporter.suggestFilename(this.realm),
          message: 'Select a destination for the data',
        });
        if (destinationPath) {
          exporter.export(this.realm, destinationPath);
        }
      } else {
        throw new Error('Realm is not open');
      }
    } catch (err) {
      showError('Failed to export data', err);
    }
  };

  private onImportIntoExistingRealm = (
    format: dataImporter.ImportFormat = dataImporter.ImportFormat.CSV,
  ) => {
    const paths = dataImporter.showOpenDialog(format);
    if (this.realm && paths && paths.length > 0) {
      try {
        const schema = dataImporter.generateSchema(format, paths);
        try {
          const importer = dataImporter.getDataImporter(format, paths, schema);
          importer.import(this.realm);
        } catch (err) {
          showError('Faild to import data', err);
        }
      } catch (err) {
        showError('Faild to generate schema', err);
      }
    }
  };

  private onSchemaChange = () => {
    if (this.realm) {
      const firstSchemaName =
        this.realm.schema.length > 0 ? this.realm.schema[0].name : undefined;
      this.setState({ classes: this.realm.schema });
      if (firstSchemaName && !this.state.focus) {
        this.onClassFocussed(firstSchemaName);
      }
    }
  };

  private performImport() {
    if (this.props.import && this.realm) {
      const { format, paths, schema } = this.props.import;
      this.setState({ importProgress: { status: 'in-progress' } });
      // Get the importer
      try {
        const importer = dataImporter.getDataImporter(format, paths, schema);
        importer.import(this.realm);
      } catch (err) {
        showError('Faild to import data', err);
      } finally {
        this.setState({ importProgress: { status: 'done' } });
      }
    }
  }

  private async copyRealmPathToClipboard(): Promise<void> {
    if (this.realm) {
      await navigator.clipboard.writeText(this.realm.path);
    } else {
      throw new Error('Realm was not loaded');
    }
  }
}

export { RealmBrowserContainer as RealmBrowser };
