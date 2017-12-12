import { ipcRenderer, remote } from 'electron';
import * as path from 'path';
import * as React from 'react';
import * as Realm from 'realm';

import { IPropertyWithName, ISelectObjectState } from '.';
import { IExportSchemaOptions } from '../../main/MainMenu';
import { SchemaExporter } from '../../services/schema-export';
import { IRealmBrowserOptions } from '../../windows/WindowType';
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

import { RealmBrowser } from './RealmBrowser';

export interface IRealmBrowserState extends IRealmLoadingComponentState {
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  createObjectSchema?: Realm.ObjectSchema;
  // A number that we can use to make components update on changes to data
  dataVersion: number;
  encryptionKey?: string;
  focus: Focus | null;
  isEncryptionDialogVisible: boolean;
  highlight?: IHighlight;
  // The schemas are only supposed to be used to produce a list of schemas in the sidebar
  schemas: Realm.ObjectSchema[];
  // TODO: Rename - Unclear if this is this an action or a piece of data
  selectObject?: ISelectObjectState;
  isAddSchemaOpen: boolean;
  isAddSchemaPropertyOpen: boolean;
}

export class RealmBrowserContainer extends RealmLoadingComponent<
  IRealmBrowserOptions,
  IRealmBrowserState
> {
  private clickTimeout?: any;

  constructor() {
    super();
    this.state = {
      confirmModal: undefined,
      dataVersion: 0,
      focus: null,
      isEncryptionDialogVisible: false,
      progress: { done: false },
      schemas: [],
      isAddSchemaOpen: false,
      isAddSchemaPropertyOpen: false,
    };
  }

  public componentDidMount() {
    this.loadRealm(this.props.realm);
    ipcRenderer.addListener('export-schema', this.onExportSchema);
  }

  public componentWillUnmount() {
    ipcRenderer.removeListener('export-schema', this.onExportSchema);
  }

  public render() {
    return <RealmBrowser {...this.state} {...this} />;
  }

  public onCellChange: CellChangeHandler = params => {
    if (this.realm) {
      try {
        this.realm.write(() => {
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
    }
  };

  public isSchemaNameAvailable = (name: string): boolean => {
    return !this.state.schemas.find(schema => schema.name === name);
  };

  public toggleAddSchema = () => {
    this.setState({
      isAddSchemaOpen: !this.state.isAddSchemaOpen,
    });
  };

  public onAddSchema = (name: string) => {
    if (this.realm) {
      try {
        this.loadRealm(this.props.realm, [
          ...this.state.schemas,
          { name, properties: {} },
        ]).then(() => this.onSchemaSelected(name));
      } catch (err) {
        showError(`Failed creating the model "${name}"`, err);
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
      isAddSchemaPropertyOpen: !this.state.isAddSchemaPropertyOpen,
    });
  };

  public onAddSchemaProperty = async (property: Realm.PropertiesTypes) => {
    if (
      this.realm &&
      this.state.focus &&
      this.state.focus.kind === 'class' &&
      this.state.focus.addColumnEnabled
    ) {
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
      try {
        this.loadRealm(this.props.realm, schemas).then(() =>
          this.onSchemaSelected((this.state.focus as IClassFocus).className),
        );
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

  public onSchemaSelected = (className: string, objectToScroll?: any) => {
    // TODO: Re-implement objectToScroll
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
    // TODO: Re-enable this, once cells are not re-rendering and forgetting their focus state
    this.setState({
      highlight: {
        column: columnIndex,
        row: rowIndex,
      },
    });
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

  public onSortStart: SortStartHandler = ({ index }) => {
    // Removing any highlight
    this.setState({
      highlight: undefined,
    });
  };

  public onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    if (this.state.focus && this.state.focus.kind === 'list') {
      const results = (this.state.focus.results as any) as Realm.List<any>;
      this.realm.write(() => {
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
      this.realm.write(() => {
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
    this.realm.write(() => this.realm.delete(object));
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
      this.onSchemaSelected(firstSchemaName);
    }
  };

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

  private onExportSchema = (
    event: any,
    { language }: IExportSchemaOptions,
  ): void => {
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
}
