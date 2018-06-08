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

import { ipcRenderer, MenuItemConstructorOptions, remote } from 'electron';
import * as path from 'path';
import * as React from 'react';
import * as Realm from 'realm';

import { ImportFormat } from '../../services/data-importer';
import { CSVDataImporter } from '../../services/data-importer/csv/CSVDataImporter';
import ImportSchemaGenerator from '../../services/data-importer/ImportSchemaGenerator';
import { Language, SchemaExporter } from '../../services/schema-export';
import { getRange, menuUtils } from '../../utils';
import {
  IMenuGenerator,
  IMenuGeneratorProps,
} from '../../windows/MenuGenerator';
import { IRealmBrowserWindowProps } from '../../windows/WindowProps';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/RealmLoadingComponent';

import { Focus, getClassName, IClassFocus, IListFocus } from './focus';
import * as primitives from './primitives';
import { RealmBrowser } from './RealmBrowser';
import * as schemaUtils from './schema-utils';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './Table';

// TODO: Remove this interface once the Realm.ObjectSchemaProperty
// has a name parameter in its type definition.
export interface IPropertyWithName extends Realm.ObjectSchemaProperty {
  name: string | null;
  readOnly: boolean;
}

export interface ISelectObjectState {
  focus: IClassFocus;
  property: IPropertyWithName;
  contentToUpdate: Realm.Object | Realm.List<any>;
}

export enum EditMode {
  Disabled = 'disabled',
  InputBlur = 'input-blur',
  KeyPress = 'key-press',
}

export type CreateObjectHandler = (className: string, values: {}) => void;
export type EditModeChangeHandler = (editMode: EditMode) => void;

export interface IConfirmModal {
  title: string;
  description: string;
  yes: () => void;
  no: () => void;
}

const EDIT_MODE_STORAGE_KEY = 'realm-browser-edit-mode';

export interface IRealmBrowserState extends IRealmLoadingComponentState {
  confirmModal?: IConfirmModal;
  createObjectSchema?: Realm.ObjectSchema;
  // A number that we can use to make components update on changes to data
  dataVersion: number;
  dataVersionAtBeginning?: number;
  editMode: EditMode;
  encryptionKey?: string;
  focus: Focus | null;
  highlight?: IHighlight;
  isAddClassOpen: boolean;
  isAddPropertyOpen: boolean;
  isEncryptionDialogVisible: boolean;
  // The schemas are only supposed to be used to produce a list of schemas in the sidebar
  schemas: Realm.ObjectSchema[];
  // TODO: Rename - Unclear if this is this an action or a piece of data
  selectObject?: ISelectObjectState;
}

class RealmBrowserContainer
  extends RealmLoadingComponent<
    IRealmBrowserWindowProps & IMenuGeneratorProps,
    IRealmBrowserState
  >
  implements IMenuGenerator {
  public state: IRealmBrowserState = {
    confirmModal: undefined,
    editMode:
      (localStorage.getItem(EDIT_MODE_STORAGE_KEY) as EditMode) ||
      EditMode.InputBlur,
    dataVersion: 0,
    focus: null,
    isEncryptionDialogVisible: false,
    progress: { status: 'idle' },
    schemas: [],
    isAddClassOpen: false,
    isAddPropertyOpen: false,
  };

  private clickTimeout?: any;
  private latestCellValidation?: {
    columnIndex: number;
    rowIndex: number;
    valid: boolean;
  };

  public componentDidMount() {
    this.loadRealm(this.props.realm);
    this.addListeners();
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    this.removeListeners();
    if (this.realm && this.realm.isInTransaction) {
      this.realm.cancelTransaction();
    }
  }

  public render() {
    return (
      <RealmBrowser
        inTransaction={this.realm && this.realm.isInTransaction ? true : false}
        {...this.state}
        {...this}
      />
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

    return menuUtils.performModifications(template, [
      {
        action: 'append',
        id: 'import',
        items: [importMenu],
      },
      {
        action: 'prepend',
        id: 'close',
        items: [exportSchemaMenu, { type: 'separator' }],
      },
      {
        action: 'append',
        id: 'select-all',
        items: [{ type: 'separator' }, ...transactionMenuItems, editModeMenu],
      },
    ]);
  }

  public onCellChange: CellChangeHandler = params => {
    try {
      this.write(() => {
        const { parent, property, rowIndex, cellValue } = params;
        if (property.name !== null) {
          parent[rowIndex][property.name] = cellValue;
        } else {
          parent[rowIndex] = cellValue;
        }
      });
    } catch (err) {
      showError('Failed when saving the value', err);
    }
  };

  public onBeginTransaction = () => {
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

  public onCommitTransaction = () => {
    if (this.realm && this.realm.isInTransaction) {
      this.realm.commitTransaction();
      this.props.updateMenu();
      this.resetDataVersion();
    } else {
      throw new Error('Cannot commit when not in a transaction');
    }
  };

  public onCancelTransaction = () => {
    if (this.realm && this.realm.isInTransaction) {
      this.realm.cancelTransaction();
      this.props.updateMenu();
      this.resetDataVersion();
    } else {
      throw new Error('Cannot cancel when not in a transaction');
    }
  };

  public isClassNameAvailable = (name: string): boolean => {
    return !this.state.schemas.find(schema => schema.name === name);
  };

  public toggleAddSchema = () => {
    this.setState({
      isAddClassOpen: !this.state.isAddClassOpen,
    });
  };

  public onAddClass = async (schema: Realm.ObjectSchema) => {
    if (this.realm) {
      try {
        // The schema version needs to be bumped for local realms
        const nextSchemaVersion = this.realm.schemaVersion + 1;
        const cleanedSchema = schemaUtils.cleanUpSchema(this.state.schemas);
        const modifiedSchema = [...cleanedSchema, schema];
        // Close the current Realm
        this.realm.close();
        // Deleting the object to indicate we've closed it
        delete this.realm;
        // Load it again with the new schema
        await this.loadRealm(
          this.props.realm,
          modifiedSchema,
          nextSchemaVersion,
        );
        // Select the schema when it the realm has loaded
        this.onClassSelected(schema.name);
      } catch (err) {
        showError(`Failed creating the model "${schema.name}"`, err);
      }
    }
  };

  public isPropertyNameAvailable = (name: string): boolean => {
    return (
      this.state.focus !== null &&
      !this.state.focus.properties.find(property => property.name === name)
    );
  };

  public toggleAddSchemaProperty = () => {
    this.setState({
      isAddPropertyOpen: !this.state.isAddPropertyOpen,
    });
  };

  public onAddProperty = async (name: string, type: Realm.PropertyType) => {
    if (
      this.realm &&
      this.state.focus &&
      this.state.focus.kind === 'class' &&
      this.state.focus.addColumnEnabled
    ) {
      try {
        const focusedClassName = this.state.focus.className;
        const nextSchemaVersion = this.realm.schemaVersion + 1;
        const cleanedSchema = schemaUtils.cleanUpSchema(this.state.schemas);
        const modifiedSchema = schemaUtils.addProperty(
          cleanedSchema,
          this.state.focus.className,
          name,
          type,
        );
        // Close the current Realm
        this.realm.close();
        // Deleting the object to indicate we've closed it
        delete this.realm;
        // Load it again with the new schema
        await this.loadRealm(
          this.props.realm,
          modifiedSchema,
          nextSchemaVersion,
        );
        // Ensure we've selected the class that we've just added a property to
        this.onClassSelected(focusedClassName);
      } catch (err) {
        showError(
          `Failed adding the property named "${name}" to the selected schema`,
          err,
        );
      }
    }
  };

  public onCreateObject = (className: string, values: {}) => {
    const { focus } = this.state;
    let rowIndex = -1;

    this.write(() => {
      // Writing makes no sense if the realm was not loaded
      if (this.realm) {
        // Adding a primitive value into a list
        if (primitives.isPrimitive(className)) {
          if (focus && focus.kind === 'list') {
            const valueToPush = (values as any)[className];
            focus.results.push(valueToPush);
            rowIndex = focus.results.indexOf(valueToPush);
          }
        } else {
          // Adding a new object into a class
          const object = this.realm.create(className, values);
          if (focus) {
            // New object has been created from a list, so we add it too into the list
            if (focus.kind === 'list') {
              focus.results.push(object);
            }
            if (getClassName(focus) === className) {
              rowIndex = focus.results.indexOf(object);
            }
          }
        }
        if (rowIndex >= 0) {
          this.setState({
            highlight: {
              ...this.state.highlight,
              rows: new Set([rowIndex]),
            },
          });
        }
      } else {
        throw new Error('onCreateObject called before realm was loaded');
      }
    });
  };

  public onClassSelected = (className: string, objectToScroll?: any) => {
    if (this.realm) {
      if (!this.latestCellValidation || this.latestCellValidation.valid) {
        const focus: IClassFocus = {
          kind: 'class',
          className,
          results: this.realm.objects(className),
          properties: this.derivePropertiesFromClassName(className),
          addColumnEnabled: true,
        };
        this.setState({
          focus,
          highlight: this.generateHighlight(objectToScroll),
        });
      } else {
        // Don't do anything before we have a valid cell validation.
      }
    } else {
      throw new Error(`Cannot select ${className} as the Realm is not opened`);
    }
  };

  public getClassFocus = (className: string) => {
    if (this.realm) {
      const results = this.realm.objects(className);
      const focus: IClassFocus = {
        kind: 'class',
        className,
        results,
        properties: this.derivePropertiesFromClassName(className),
        addColumnEnabled: true,
      };
      return focus;
    } else {
      throw new Error('getClassFocus called before realm was loaded');
    }
  };

  public getSchemaLength = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  };

  public onCellClick: CellClickHandler = (
    { rowObject, property, cellValue, rowIndex, columnIndex },
    e,
  ) => {
    const shiftClick = e && e.shiftKey;
    const metaClick = e && e.metaKey; // Command key in MacOs

    const currentRowReferenceShiftClick =
      this.state.highlight && this.state.highlight.lastRowIndexClicked;
    const clickWhenNoRowHighlighted =
      currentRowReferenceShiftClick === undefined;
    const normalClick = !shiftClick && !metaClick;
    const nextRowReferenceShiftClick =
      clickWhenNoRowHighlighted || normalClick || metaClick
        ? rowIndex
        : currentRowReferenceShiftClick;

    const nextRowsHighlighted =
      this.state.highlight && this.state.highlight.rows
        ? new Set(this.state.highlight.rows)
        : new Set();

    if (metaClick) {
      // Unselect the row when It was already selected otherwise select it
      if (nextRowsHighlighted.has(rowIndex)) {
        nextRowsHighlighted.delete(rowIndex);
      } else {
        nextRowsHighlighted.add(rowIndex);
      }
    } else if (shiftClick) {
      // Select all the rows from the row previously referenced to the last row clicked
      if (nextRowReferenceShiftClick !== undefined) {
        const rowIndexRange = getRange(nextRowReferenceShiftClick, rowIndex);
        for (const i of rowIndexRange) {
          nextRowsHighlighted.add(i);
        }
      }
    } else {
      nextRowsHighlighted.clear();
      nextRowsHighlighted.add(rowIndex);
    }

    if (!this.latestCellValidation || this.latestCellValidation.valid) {
      // Ensuring that the last cell validation didn't fail
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.onCellDoubleClick(rowObject, property, cellValue);
        this.clickTimeout = null;
      } else {
        this.clickTimeout = setTimeout(() => {
          this.onCellSingleClick(rowObject, property, cellValue);
          this.clickTimeout = null;
        }, 200);
      }

      this.setState({
        highlight: {
          rows: nextRowsHighlighted,
          column: columnIndex,
          lastRowIndexClicked: rowIndex,
        },
      });
    }
  };

  public onCellSingleClick = (
    object: any,
    property: IPropertyWithName,
    value: any,
  ) => {
    if (property.type === 'list') {
      const focus: IListFocus = {
        kind: 'list',
        parent: object,
        property,
        properties: this.derivePropertiesFromProperty(property),
        results: value,
      };
      this.setState({
        focus,
        highlight: undefined,
      });
    } else if (property.type === 'object' && value) {
      const className = property.objectType;
      if (className) {
        const focus = this.getClassFocus(className);
        const rowIndex = focus.results.indexOf(value);

        this.setState({
          focus,
          highlight: {
            rows: new Set([rowIndex]),
            center: true,
          },
        });
      }
    }
  };

  public onCellDoubleClick = (
    object: any,
    property: IPropertyWithName,
    value: any,
  ) => {
    if (property.type === 'object') {
      this.openSelectObject(object, property);
    }
  };

  public onCellHighlighted = ({
    rowIndex,
    columnIndex,
  }: {
    rowIndex: number;
    columnIndex: number;
  }) => {
    if (!this.latestCellValidation || this.latestCellValidation.valid) {
      this.setState({
        highlight: {
          rows: new Set([rowIndex]),
          column: columnIndex,
          lastRowIndexClicked: rowIndex,
        },
      });
    }
  };

  public onContextMenu: CellContextMenuHandler = (
    e: React.MouseEvent<any>,
    params,
  ) => {
    e.preventDefault();
    const { focus } = this.state;

    const contextMenu = new remote.Menu();

    if (params) {
      const { property, rowObject, rowIndex, columnIndex } = params;

      // If the clicked row was not highlighted - highlight only that
      if (!this.state.highlight || !this.state.highlight.rows.has(rowIndex)) {
        this.onCellHighlighted({ rowIndex, columnIndex });
        // Wait 200ms to allow the state to update and call recursively
        window.setTimeout(() => {
          return this.onContextMenu(e, params);
        }, 200);
        return;
      }

      // If we clicked a property that refers to an object
      if (property && property.type === 'object') {
        contextMenu.append(
          new remote.MenuItem({
            label: 'Update reference',
            click: () => {
              this.openSelectObject(rowObject, property);
            },
          }),
        );
      }

      // If we have one or more rows highlighted - we can delete those
      if (focus && this.state.highlight && this.state.highlight.rows.size > 0) {
        const { label, title, description } = this.generateDeleteTexts(
          focus,
          this.state.highlight.rows.size > 1,
        );

        contextMenu.append(
          new remote.MenuItem({
            label,
            click: () => {
              this.openConfirmModal(title, description, () => {
                if (this.state.highlight) {
                  this.deleteObjects(this.state.highlight.rows);
                  this.setState({ highlight: undefined });
                }
              });
            },
          }),
        );
      }
    }

    if (focus) {
      const rowsHighlighted = this.state.highlight && this.state.highlight.rows;

      if (rowsHighlighted && rowsHighlighted.size > 1) {
        const title = 'Deleting objects...';
        const description = 'Are you sure you want to delete this objects?';
      }
    }

    // If we right-clicking on the content we can add an existing object when we are focusing an object list
    if (
      focus &&
      focus.kind === 'list' &&
      focus.property.objectType &&
      !primitives.isPrimitive(focus.property.objectType)
    ) {
      const className = getClassName(focus);
      menu.append(
        new remote.MenuItem({
          label: `Add existing ${className}`,
          click: () => {
            this.openSelectObject(focus.results, focus.property);
          },
        }),
      );
    }

    // If we right-clicking on the content we can always create a new object
    if (focus) {
      const className = getClassName(focus);
      menu.append(
        new remote.MenuItem({
          label: `Create new ${className}`,
          click: () => {
            this.onCreateDialogToggle(className);
          },
        }),
      );
    }

    // If we have items to show - popup the menu
    if (menu.items.length > 0) {
      menu.popup(remote.getCurrentWindow(), {
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  public onNewObjectClick = () => {
    const { focus } = this.state;

    if (focus) {
      const className = getClassName(focus);
      this.onCreateDialogToggle(className);
    }
  };

  public onCellValidated = (
    rowIndex: number,
    columnIndex: number,
    valid: boolean,
  ) => {
    this.latestCellValidation = {
      columnIndex,
      rowIndex,
      valid,
    };
  };

  public onCreateDialogToggle = (className?: string) => {
    if (this.realm && className) {
      const createObjectSchema =
        className && primitives.isPrimitive(className)
          ? {
              name: className,
              properties: {
                [className]: {
                  type: className,
                },
              },
            }
          : this.realm.schema.find(schema => schema.name === className);
      this.setState({ createObjectSchema });
    } else {
      this.setState({ createObjectSchema: undefined });
    }
  };

  public onEditModeChange: EditModeChangeHandler = editMode => {
    localStorage.setItem(EDIT_MODE_STORAGE_KEY, editMode);
    this.setState({ editMode });
  };

  public onSortStart: SortStartHandler = ({ index }) => {
    // Removing any highlight
    this.setState({
      highlight: undefined,
    });
  };

  public onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    if (this.state.focus && this.state.focus.kind === 'list') {
      const results = (this.state.focus.results as any) as Realm.List<any>;
      this.write(() => {
        const movedElements = results.splice(oldIndex, 1);
        results.splice(newIndex, 0, movedElements[0]);
      });
    }
    this.setState({
      highlight: {
        ...this.state.highlight,
        rows: new Set([newIndex]),
      },
    });
  };

  public openSelectObject = (
    contentToUpdate: Realm.Object | Realm.List<any>,
    property: IPropertyWithName,
  ) => {
    if (this.realm && property.objectType) {
      const className = property.objectType;
      const results = this.realm.objects(className) || null;
      const focus: IClassFocus = {
        kind: 'class',
        className,
        properties: this.derivePropertiesFromClassName(className),
        results,
        addColumnEnabled: false,
      };
      this.setState({
        selectObject: {
          focus,
          property,
          contentToUpdate,
        },
      });
    } else {
      throw new Error('Expected a loaded realm a property with an objectType');
    }
  };

  public updateObjectReference = (reference: any) => {
    const { selectObject } = this.state;
    if (selectObject) {
      const contentToUpdate: any = selectObject.contentToUpdate;
      const propertyName = selectObject.property.name;
      this.write(() => {
        // Distinguish when we are updating an object or adding an existing object into a list
        if (contentToUpdate.length >= 0) {
          contentToUpdate.push(reference);
        } else if (propertyName) {
          contentToUpdate[propertyName] = reference;
        }
      });
      this.setState({ selectObject: undefined });
    }
  };

  public toggleSelectObject = () => {
    this.setState({ selectObject: undefined });
  };

  public openConfirmModal = (
    title: string,
    description: string,
    onYesCallback: () => void,
  ) => {
    this.setState({
      confirmModal: {
        title,
        description,
        yes: () => {
          onYesCallback();
          this.closeConfirmModal();
        },
        no: this.closeConfirmModal,
      },
    });
  };

  public closeConfirmModal = () => this.setState({ confirmModal: undefined });

  public deleteObjects = (rowIndecies: Set<number>) => {
    const { focus } = this.state;

    if (focus) {
      try {
        this.write(() => {
          if (this.realm && focus.kind === 'class') {
            for (const index of rowIndecies) {
              const object = focus.results[index];
              this.realm.delete(object);
            }
          } else if (focus.kind === 'list') {
            for (const index of rowIndecies) {
              focus.results.splice(index, 1);
            }
          }
        });
      } catch (err) {
        showError('Error deleting the object', err);
      }
    }
  };

  public onHideEncryptionDialog = () => {
    this.setState({ isEncryptionDialogVisible: false });
  };

  public onOpenWithEncryption = (key: string) => {
    this.setState({ encryptionKey: key });
    const encryptionKey = Buffer.from(key, 'hex');
    this.loadRealm({
      ...this.props.realm,
      encryptionKey,
    });
  };

  public onResetHighlight = () => {
    this.setState({ highlight: this.generateHighlight() });
  };

  protected onRealmChanged = () => {
    this.setState({ dataVersion: this.state.dataVersion + 1 });
  };

  protected onRealmLoaded = () => {
    if (!this.realm) {
      throw new Error('onRealmLoaded was called without a realm sat');
    }
    const firstSchemaName =
      this.realm.schema.length > 0 ? this.realm.schema[0].name : undefined;
    this.setState({
      schemas: this.realm.schema,
    });
    if (firstSchemaName) {
      this.onClassSelected(firstSchemaName);
    }
  };

  protected onBeforeUnload = (e: BeforeUnloadEvent) => {
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
      remote.dialog.showMessageBox(
        currentWindow,
        {
          type: 'warning',
          message: `You have ${unsavedChanges} unsaved change${plural}`,
          buttons: ['Save and close', 'Discard and close', 'Cancel'],
        },
        result => {
          if (result === 0 || result === 1) {
            if (result === 0) {
              this.onCommitTransaction();
            } else if (result === 1) {
              this.onCancelTransaction();
            }
            // Allow the for the state to update
            process.nextTick(() => {
              window.close();
            });
          }
        },
      );
    }
  };

  protected addListeners() {
    ipcRenderer.addListener('export-schema', this.onExportSchema);
    window.addEventListener<'beforeunload'>(
      'beforeunload',
      this.onBeforeUnload,
    );
  }

  protected removeListeners() {
    ipcRenderer.removeListener('export-schema', this.onExportSchema);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  protected derivePropertiesFromProperty(
    property: IPropertyWithName,
  ): IPropertyWithName[] {
    // Determine the properties
    if (property.type === 'list' && property.objectType) {
      const properties: IPropertyWithName[] = [
        { name: '#', type: 'int', readOnly: true },
      ];
      if (primitives.isPrimitive(property.objectType)) {
        return properties.concat([
          {
            name: null,
            type: property.objectType,
            readOnly: false,
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

  protected derivePropertiesFromClassName(
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
          ...property,
        };
      } else {
        throw new Error(`Object schema had a string describing its property`);
      }
    });
  }

  protected generateHighlight(object?: Realm.Object): IHighlight | undefined {
    if (!this.realm) {
      throw new Error('generateHighlight called before realm was loaded');
    }
    if (object) {
      const className = object.objectSchema().name;
      const rowIndex = this.realm.objects(className).indexOf(object);
      return {
        rows: new Set(rowIndex >= 0 ? [rowIndex] : []),
      };
    }
  }

  protected loadingRealmFailed(err: Error) {
    const message = err.message || '';
    const mightBeEncrypted = message.indexOf('Not a Realm file.') >= 0;
    if (mightBeEncrypted) {
      this.setState({
        isEncryptionDialogVisible: true,
        progress: {
          status: 'done',
        },
      });
    } else {
      super.loadingRealmFailed(err);
    }
  }

  protected write(callback: () => void) {
    if (!this.realm) {
      throw new Error('write called before realm was loaded');
    }
    if (this.realm.isInTransaction) {
      callback();
      // We have to signal changes manually
      this.onRealmChanged();
    } else {
      this.realm.write(callback);
    }
  }

  protected resetDataVersion() {
    if (typeof this.state.dataVersionAtBeginning === 'number') {
      this.setState({
        dataVersion: this.state.dataVersionAtBeginning,
        dataVersionAtBeginning: undefined,
      });
    }
  }

  protected generateDeleteTexts(focus: Focus, multiple: boolean) {
    if (focus.kind === 'list') {
      if (multiple) {
        return {
          label: 'Remove selected rows from the list',
          title: 'Removing rows',
          description:
            'Are you sure you want to remove these rows from the list?',
        };
      } else {
        return {
          label: 'Remove selected row from the list',
          title: 'Removing row',
          description:
            'Are you sure you want to remove this row from the list?',
        };
      }
    } else {
      if (multiple) {
        return {
          label: 'Delete selected objects',
          title: 'Delete objects',
          description: 'Are you sure you want to delete these objects?',
        };
      } else {
        return {
          label: 'Delete selected object',
          title: 'Delete object',
          description: 'Are you sure you want to delete this object?',
        };
      }
    }
  }

  private onExportSchema = (language: Language): void => {
    const basename = path.basename(this.props.realm.path, '.realm');
    remote.dialog.showSaveDialog(
      {
        defaultPath: `${basename}-schemas`,
        message: `Select a directory to store the ${language} schema files`,
      },
      selectedPath => {
        if (selectedPath && this.realm) {
          const exporter = SchemaExporter(language);
          exporter.exportSchema(this.realm);
          exporter.writeFilesToDisk(selectedPath);
        }
      },
    );
  };

  private onImportIntoExistingRealm = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'CSV File(s)', extensions: ['csv', 'CSV'] }],
      },
      selectedPaths => {
        if (selectedPaths && this.realm) {
          const schemaGenerator = new ImportSchemaGenerator(
            ImportFormat.CSV,
            selectedPaths,
          );
          const schema = schemaGenerator.generate();
          const importer = new CSVDataImporter(selectedPaths, schema);
          try {
            importer.importInto(this.realm);
          } catch (e) {
            const { dialog } = require('electron').remote;
            dialog.showErrorBox('Inserting CSV data failed', e.message);
          }
        }
      },
    );
  };
}

export { RealmBrowserContainer as RealmBrowser };
