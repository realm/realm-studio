import * as assert from 'assert';
import { ipcRenderer, MenuItemConstructorOptions, remote } from 'electron';
import * as path from 'path';
import * as React from 'react';
import * as Realm from 'realm';

import {
  EditMode,
  EditModeChangeHandler,
  IPropertyWithName,
  ISelectObjectState,
} from '.';
import { RealmLoadingMode } from '../../services/ros/realms';
import { Language, SchemaExporter } from '../../services/schema-export';
import {
  IMenuGenerator,
  IMenuGeneratorProps,
} from '../../windows/MenuGenerator';
import { IRealmBrowserWindowProps } from '../../windows/WindowType';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/realm-loading-component';
import { Focus, IClassFocus, IListFocus } from './focus';
import * as primitives from './primitives';
import { isSelected } from './Sidebar';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './table';

import { ImportFormat } from '../../services/data-importer';
import { CSVDataImporter } from '../../services/data-importer/csv/CSVDataImporter';
import ImportSchemaGenerator from '../../services/data-importer/ImportSchemaGenerator';
import { RealmBrowser } from './RealmBrowser';

const EDIT_MODE_STORAGE_KEY = 'realm-browser-edit-mode';

export interface IRealmBrowserState extends IRealmLoadingComponentState {
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  createObjectSchema?: Realm.ObjectSchema;
  // A number that we can use to make components update on changes to data
  dataVersion: number;
  dataVersionAtBeginning?: number;
  editMode: EditMode;
  encryptionKey?: string;
  focus: Focus | null;
  isEncryptionDialogVisible: boolean;
  highlight?: IHighlight;
  // The schemas are only supposed to be used to produce a list of schemas in the sidebar
  schemas: Realm.ObjectSchema[];
  // TODO: Rename - Unclear if this is this an action or a piece of data
  selectObject?: ISelectObjectState;
  isAddClassOpen: boolean;
  isAddPropertyOpen: boolean;
}

export class RealmBrowserContainer extends RealmLoadingComponent<
  IRealmBrowserWindowProps & IMenuGeneratorProps,
  IRealmBrowserState
> implements IMenuGenerator {
  private clickTimeout?: any;
  private latestCellValidation: {
    columnIndex: number;
    rowIndex: number;
    valid: boolean;
  };

  constructor() {
    super();
    const editMode = localStorage.getItem(EDIT_MODE_STORAGE_KEY) as EditMode;
    this.state = {
      confirmModal: undefined,
      editMode: editMode || EditMode.InputBlur,
      dataVersion: 0,
      focus: null,
      isEncryptionDialogVisible: false,
      progress: { done: false },
      schemas: [],
      isAddClassOpen: false,
      isAddPropertyOpen: false,
    };
  }

  public componentWillMount() {
    this.props.addMenuGenerator(this);
  }

  public componentDidMount() {
    this.loadRealm(this.props.realm);
    this.addListeners();
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    this.removeListeners();
    this.props.removeMenuGenerator(this);
    if (this.realm && this.realm.isInTransaction) {
      this.realm.cancelTransaction();
    }
  }

  public render() {
    return (
      <RealmBrowser
        inTransaction={this.realm && this.realm.isInTransaction}
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

    const separator: MenuItemConstructorOptions = {
      type: 'separator',
    };

    const exportMenu: MenuItemConstructorOptions = {
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

    return template.map(menu => {
      if (menu.id === 'file' && Array.isArray(menu.submenu)) {
        const closeIndex = menu.submenu.findIndex(item => item.id === 'close');
        if (closeIndex) {
          const submenu = [
            ...menu.submenu.slice(0, closeIndex),
            exportMenu,
            importMenu,
            separator,
            ...menu.submenu.slice(closeIndex),
          ];
          return {
            ...menu,
            submenu,
          };
        } else {
          return menu;
        }
      } else if (menu.id === 'edit' && Array.isArray(menu.submenu)) {
        const selectAllIndex = menu.submenu.findIndex(
          item => item.id === 'select-all',
        );
        if (selectAllIndex) {
          const submenu = [
            ...menu.submenu.slice(0, selectAllIndex + 1),
            separator,
            ...transactionMenuItems,
            editModeMenu,
            ...menu.submenu.slice(selectAllIndex + 1),
          ];
          return {
            ...menu,
            submenu,
          };
        } else {
          return menu;
        }
      } else {
        return menu;
      }
    });
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
        // Close the current Realm
        this.realm.close();
        // Deleting the object to indicate we've closed it
        delete this.realm;
        // Load it again with the new schema
        await this.loadRealm(
          this.props.realm,
          [...this.state.schemas, schema],
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

  public onAddProperty = async (property: Realm.PropertiesTypes) => {
    if (
      this.realm &&
      this.state.focus &&
      this.state.focus.kind === 'class' &&
      this.state.focus.addColumnEnabled
    ) {
      try {
        const focusedClassName = this.state.focus.className;
        const nextSchemaVersion = this.realm.schemaVersion + 1;
        const schemas = this.state.schemas.map(
          schema =>
            isSelected(this.state.focus, schema.name)
              ? {
                  ...schema,
                  properties: {
                    ...schema.properties,
                    ...property,
                  },
                }
              : schema,
        );
        // Close the current Realm
        this.realm.close();
        // Deleting the object to indicate we've closed it
        delete this.realm;
        // Load it again with the new schema
        await this.loadRealm(this.props.realm, schemas, nextSchemaVersion);
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
    this.realm.write(() => {
      const object = this.realm.create(className, values);
      const { focus } = this.state;
      if (focus && focus.kind === 'class') {
        if (focus.className === className) {
          const rowIndex = focus.results.indexOf(object);
          if (rowIndex >= 0) {
            this.setState({
              highlight: {
                row: rowIndex,
              },
            });
          }
        } else {
          // TODO: If objects are created on a list - insert it into the list
        }
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
    const results = this.realm.objects(className);
    const focus: IClassFocus = {
      kind: 'class',
      className,
      results,
      properties: this.derivePropertiesFromClassName(className),
      addColumnEnabled: true,
    };
    return focus;
  };

  public getSchemaLength = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  };

  public onCellClick: CellClickHandler = ({
    rowObject,
    property,
    cellValue,
    rowIndex,
    columnIndex,
  }) => {
    // Ensuring that the last cell validation didn't fail
    if (!this.latestCellValidation || this.latestCellValidation.valid) {
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
          column: columnIndex,
          row: rowIndex,
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
        const index = focus.results.indexOf(value);
        this.setState({
          focus,
          highlight: {
            row: index,
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

  public onCellHighlighted = (highlight: IHighlight) => {
    if (!this.latestCellValidation || this.latestCellValidation.valid) {
      this.setState({ highlight });
    }
  };

  public onContextMenu: CellContextMenuHandler = (
    e: React.MouseEvent<any>,
    params,
  ) => {
    e.preventDefault();
    const { focus } = this.state;

    const menu = new remote.Menu();

    if (params) {
      const { property, rowObject } = params;

      // If we clicked a property that refers to an object
      if (property && property.type === 'object') {
        menu.append(
          new remote.MenuItem({
            label: 'Update reference',
            click: () => {
              this.openSelectObject(rowObject, property);
            },
          }),
        );
      }

      // If we clicked on a row when focussing on a class
      if (focus && focus.kind === 'class') {
        if (rowObject) {
          menu.append(
            new remote.MenuItem({
              label: 'Delete',
              click: () => {
                this.openConfirmModal(rowObject);
              },
            }),
          );
        }
      }
    }

    // We can always create a new object if right-clicking in a class focus
    if (focus && focus.kind === 'class') {
      menu.append(
        new remote.MenuItem({
          label: `Create new ${focus.className}`,
          click: () => {
            this.onCreateDialogToggle(focus.className);
          },
        }),
      );
    }

    // If we have items to shpw - popup the menu
    if (menu.items.length > 0) {
      menu.popup(remote.getCurrentWindow(), {
        x: e.clientX,
        y: e.clientY,
      });
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
      const createObjectSchema = this.realm.schema.find(
        schema => schema.name === className,
      );
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
        row: newIndex,
      },
    });
  };

  public openSelectObject = (
    object: Realm.Object,
    property: IPropertyWithName,
  ) => {
    const { schemas } = this.state;

    if (property.objectType) {
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
          object,
        },
      });
    } else {
      throw new Error('Expected a property with an objectType');
    }
  };

  public updateObjectReference = (reference: any) => {
    const { selectObject } = this.state;
    if (selectObject) {
      const object: any = selectObject.object;
      const propertyName = selectObject.property.name;
      this.write(() => {
        if (propertyName) {
          object[propertyName] = reference;
        }
      });
      this.setState({ selectObject: undefined });
    }
  };

  public toggleSelectObject = () => {
    this.setState({ selectObject: undefined });
  };

  public openConfirmModal = (object: any) => {
    this.setState({
      confirmModal: {
        yes: () => this.deleteObject(object),
        no: () => this.setState({ confirmModal: undefined }),
      },
    });
  };

  public deleteObject = (object: Realm.Object) => {
    this.write(() => {
      this.realm.delete(object);
    });
    this.setState({ highlight: undefined, confirmModal: undefined });
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

  protected onRealmChanged = () => {
    this.setState({ dataVersion: this.state.dataVersion + 1 });
  };

  protected onRealmLoaded = () => {
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
    if (object) {
      const className = object.objectSchema().name;
      const row = this.realm.objects(className).indexOf(object);
      if (row) {
        return {
          row,
        };
      }
    }
  }

  protected loadingRealmFailed(err: Error) {
    const message = err.message || '';
    const mightBeEncrypted = message.indexOf('Not a Realm file.') >= 0;
    if (mightBeEncrypted) {
      this.setState({
        isEncryptionDialogVisible: true,
        progress: {
          done: true,
        },
      });
    } else {
      super.loadingRealmFailed(err);
    }
  }

  protected write(callback: () => void) {
    if (this.realm && this.realm.isInTransaction) {
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

  private onExportSchema = (language: Language): void => {
    const basename = path.basename(this.props.realm.path, '.realm');
    remote.dialog.showSaveDialog(
      {
        defaultPath: `${basename}-schemas`,
        message: `Select a directory to store the ${language} schema files`,
      },
      selectedPath => {
        if (selectedPath) {
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
        if (selectedPaths) {
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
