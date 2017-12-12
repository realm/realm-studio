import * as assert from 'assert';
import { ipcRenderer, MenuItemConstructorOptions, remote } from 'electron';
import * as path from 'path';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

import { IPropertyWithName, ISelectObjectState } from '.';
import { Language, SchemaExporter } from '../../services/schema-export';
import {
  IMenuGenerator,
  IMenuGeneratorProps,
} from '../../windows/MenuGenerator';
import { IRealmBrowserOptions } from '../../windows/WindowType';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/realm-loading-component';
import { Focus, IClassFocus, IListFocus } from './focus';
import * as primitives from './primitives';
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
}

export class RealmBrowserContainer extends RealmLoadingComponent<
  IRealmBrowserOptions & IMenuGeneratorProps,
  IRealmBrowserState
> implements IMenuGenerator {
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
    };
  }

  public componentWillMount() {
    this.props.addMenuGenerator(this);
  }

  public componentDidMount() {
    this.loadRealm(this.props.realm);
  }

  public componentWillUnmount() {
    this.props.removeMenuGenerator(this);
  }

  public render() {
    return <RealmBrowser {...this.state} {...this} />;
  }

  public generateMenu(template: MenuItemConstructorOptions[]) {
    const exportMenu = {
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

    return template.map(menu => {
      if (menu.id === 'file' && Array.isArray(menu.submenu)) {
        const importIndex = menu.submenu.findIndex(
          item => item.id === 'import',
        );
        if (importIndex) {
          const submenu = [
            ...menu.submenu.slice(0, importIndex),
            exportMenu,
            ...menu.submenu.slice(importIndex),
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
    { rowObject, rowIndex, property },
  ) => {
    e.preventDefault();

    const menu = new remote.Menu();
    if (property.type === 'object') {
      menu.append(
        new remote.MenuItem({
          label: 'Update reference',
          click: () => {
            this.openSelectObject(rowObject, property);
          },
        }),
      );
    }

    const { focus } = this.state;

    if (focus && focus.kind === 'class') {
      menu.append(
        new remote.MenuItem({
          label: 'Delete',
          click: () => {
            this.openConfirmModal(rowObject);
          },
        }),
      );
      menu.append(
        new remote.MenuItem({
          label: `Create new ${focus.className}`,
          click: () => {
            this.onCreateDialogToggle(focus.className);
          },
        }),
      );
    }

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
}
