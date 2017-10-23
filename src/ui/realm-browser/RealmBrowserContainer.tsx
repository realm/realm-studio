import * as assert from 'assert';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

import { IPropertyWithName } from '.';
import { IRealmBrowserOptions } from '../../windows/WindowType';
import { IContextMenuAction } from '../reusable/context-menu';
import { showError } from '../reusable/errors';
import {
  IRealmLoadingComponentState,
  RealmLoadingComponent,
} from '../reusable/realm-loading-component';
import { IClassFocus, IFocus, IListFocus } from './focus';
import { CellChangeHandler, CellClickHandler, IHighlight } from './table';
import * as primitives from './table/types/primitives';

import { RealmBrowser } from './RealmBrowser';

export interface IRealmBrowserState extends IRealmLoadingComponentState {
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
  highlight?: IHighlight;
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

export class RealmBrowserContainer extends RealmLoadingComponent<
  IRealmBrowserOptions,
  IRealmBrowserState
> {
  private clickTimeout?: any;

  constructor() {
    super();
    this.state = {
      confirmModal: undefined,
      contextMenu: null,
      focus: null,
      progress: { done: false },
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

  public onCellChange: CellChangeHandler = params => {
    if (this.realm) {
      this.realm.write(() => {
        const { parent, property, rowIndex, cellValue } = params;
        if (property.name !== null) {
          parent[rowIndex][property.name] = cellValue;
        } else {
          parent[rowIndex] = cellValue;
        }
      });
    }
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
    this.setState({
      highlight: {
        row: rowIndex,
        column: columnIndex,
      },
    });

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
          highlight: {
            row: index,
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
        highlight: {
          row: rowIndex,
        },
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
    this.setState({ highlight: undefined, confirmModal: undefined });
  };

  public onContextMenuClose = (): void => {
    this.setState({ contextMenu: null });
  };

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

  protected derivePropertiesFromProperty(
    property: IPropertyWithName,
  ): IPropertyWithName[] {
    // Determine the properties
    if (property.type === 'list' && property.objectType) {
      const properties: IPropertyWithName[] = [
        { name: '#', type: 'int', readOnly: true },
      ];
      if (primitives.TYPES.indexOf(property.objectType) >= 0) {
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
