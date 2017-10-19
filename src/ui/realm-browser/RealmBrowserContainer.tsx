import * as assert from 'assert';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

import { IRealmBrowserOptions } from '../../windows/WindowType';
import { IContextMenuAction } from '../reusable/context-menu';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/realm-loading-component';
import { IPropertyWithName } from './ContentContainer';
import { IClassFocus, IFocus, IListFocus } from './focus';
import * as primitives from './types/primitives';

import { RealmBrowser } from './RealmBrowser';

export interface IRealmBrowserState extends IRealmLoadingComponentState {
  columnToHighlight?: number;
  confirmModal?: {
    yes: () => void;
    no: () => void;
  };
  contextMenu: {
    x: number;
    y: number;
    object: any;
    actions: IContextMenuAction[];
  } | null;
  focus: IFocus | null;
  rowToHighlight?: number;
  // The schemas are only supposed to be used to produce a list of schemas in the sidebar
  schemas: Realm.ObjectSchema[];
  // TODO: Rename - Unclear if this is this an action or a piece of data
  selectObject?: {
    schema: Realm.ObjectSchema | null;
    data: Realm.Results<any> | any;
    property: any;
    schemaName: string;
    object: any;
    optional: boolean;
  } | null;
}

export interface ICellChangeOptions {
  parent: { [index: number]: any };
  rowIndex: number;
  propertyName: string | null;
  value: any;
}

export class RealmBrowserContainer extends RealmLoadingComponent<
  IRealmBrowserOptions,
  IRealmBrowserState
> {
  private clickTimeout?: any;

  constructor() {
    super();
    this.state = {
      columnToHighlight: undefined,
      confirmModal: undefined,
      contextMenu: null,
      focus: null,
      progress: { done: false },
      rowToHighlight: undefined,
      schemas: [],
      selectObject: null,
    };
  }

  public async componentDidMount() {
    try {
      this.loadRealm(this.props.realm);
    } catch (err) {
      showError('Failed to open the Realm', err);
    }
  }

  public componentWillUnmount() {
    if (this.realm) {
      this.removeRealmChangeListener();
      this.realm.close();
    }
  }

  public render() {
    return <RealmBrowser {...this.state} {...this} />;
  }

  public onCellChange = (options: ICellChangeOptions) => {
    if (this.realm) {
      this.realm.write(() => {
        const {
          parent,
          propertyName,
          rowIndex,
          value,
        } = options as ICellChangeOptions;
        if (propertyName !== null) {
          parent[rowIndex][propertyName] = value;
        } else {
          parent[rowIndex] = value;
        }
      });
    }
  };

  public onSchemaSelected = (className: string, objectToScroll?: any) => {
    // TODO: Re-implement objectToScroll
    const rowToHighlight = objectToScroll
      ? this.realm.objects(className).indexOf(objectToScroll)
      : undefined;
    const focus: IClassFocus = {
      kind: 'class',
      className,
      results: this.realm.objects(className),
      properties: this.derivePropertiesFromClassName(className),
    };
    this.setState({
      focus,
      rowToHighlight,
      columnToHighlight: undefined,
    });
  };

  public getSchemaLength = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  };

  public onCellClick = (
    object: any,
    property: IPropertyWithName,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => {
    this.setState({ rowToHighlight: rowIndex, columnToHighlight: columnIndex });

    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.onCellDoubleClick(object, property, value);
      this.clickTimeout = null;
    } else {
      this.clickTimeout = setTimeout(() => {
        this.onCellSingleClick(object, property, value);
        this.clickTimeout = null;
      }, 200);
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
        rowToHighlight: undefined,
        columnToHighlight: undefined,
      });
    } else if (property.type === 'object' && value) {
      const className = property.objectType;
      if (className) {
        const results = this.realm.objects(className);
        const index = results.indexOf(value);
        const focus: IClassFocus = {
          kind: 'class',
          className,
          results,
          properties: this.derivePropertiesFromClassName(className),
        };
        this.setState({
          focus,
          rowToHighlight: index,
          columnToHighlight: 0,
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

  public onContextMenu = (
    e: React.MouseEvent<any>,
    object: Realm.Object,
    rowIndex: number,
    property: Realm.ObjectSchemaProperty,
  ) => {
    e.preventDefault();
    const actions = [];

    if (property.type === 'object') {
      actions.push({
        label: 'Update reference',
        onClick: () => this.openSelectObject(object, property),
      });
    }

    if (this.state.focus && this.state.focus.kind === 'class') {
      actions.push({
        label: 'Delete',
        onClick: () => this.openConfirmModal(object),
      });
    }

    if (actions.length > 0) {
      this.setState({
        rowToHighlight: rowIndex,
        contextMenu: {
          x: e.clientX,
          y: e.clientY,
          object,
          actions,
        },
      });
    }
  };

  public openSelectObject = (object: any, property: any) => {
    const { schemas } = this.state;

    const objectSchema =
      schemas.find(schema => schema.name === property.objectType) || null;
    const data = this.realm.objects(property.objectType) || null;

    this.setState({
      selectObject: {
        property,
        object,
        optional: property.optional,
        schemaName: property.objectType,
        schema: objectSchema,
        data,
      },
    });
  };

  public updateObjectReference = (reference: any) => {
    const { selectObject } = this.state;
    if (selectObject) {
      const { property, object } = selectObject;
      this.realm.write(() => {
        object[property.name] = reference;
      });
      this.setState({ selectObject: null });
    }
  };

  public closeSelectObject = () => {
    this.setState({ selectObject: null });
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
    this.setState({ rowToHighlight: undefined, confirmModal: undefined });
  };

  public onContextMenuClose = (): void => {
    this.setState({ contextMenu: null });
  };

  protected onRealmChanged = () => {
    this.forceUpdate();
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

  protected derivePropertiesFromProperty(property: IPropertyWithName) {
    // Determine the properties
    if (property.type === 'list' && property.objectType) {
      if (primitives.TYPES.indexOf(property.objectType) >= 0) {
        return [{ name: null, type: property.objectType }];
      } else {
        return this.derivePropertiesFromClassName(property.objectType);
      }
    } else {
      throw new Error(`Expected a list property with an objectType`);
    }
  }

  protected derivePropertiesFromClassName(className: string) {
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
          ...property,
        };
      } else {
        throw new Error(`Object schema had a string describing its property`);
      }
    });
  }

  private addRealmChangeListener() {
    if (this.realm) {
      this.realm.addListener('change', this.onRealmChanged);
    }
  }

  private removeRealmChangeListener() {
    if (this.realm) {
      this.realm.removeListener('change', this.onRealmChanged);
    }
  }
}
