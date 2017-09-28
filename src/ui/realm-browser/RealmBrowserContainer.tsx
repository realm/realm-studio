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

import { RealmBrowser } from './RealmBrowser';

export interface IList {
  data: Realm.List<any>;
  parent: Realm.Object | any;
  property: Realm.ObjectSchemaProperty | any;
  schemaName: string;
}

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
  isOpeningRealm: boolean;
  list?: IList;
  rowToHighlight?: number;
  schemas: Realm.ObjectSchema[];
  selectedSchemaName?: string;
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
      columnToHighlight: undefined,
      confirmModal: undefined,
      contextMenu: null,
      isOpeningRealm: false,
      list: undefined,
      progress: { done: false },
      rowToHighlight: undefined,
      schemas: [],
      selectedSchemaName: undefined,
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
    return <RealmBrowser {...this.state} {...this.props} {...this} />;
  }

  public getSelectedData = (): any => {
    const { list, selectedSchemaName } = this.state;
    if (this.realm && selectedSchemaName) {
      return list ? list.data : this.realm.objects(selectedSchemaName);
    } else {
      return [];
    }
  };

  public onCellChange = (object: any, propertyName: string, value: string) => {
    if (this.realm && object) {
      this.realm.write(() => {
        // TODO: Apply the various data parsings and transformations, based on the type
        object[propertyName] = value;
      });
    }
  };

  public onCellChangeOrder = (currentIndex: number, newIndex: number) => {
    const { list } = this.state;
    if (list) {
      const properIndex =
        newIndex > list.data.length
          ? list.data.length - 1
          : newIndex < 0 ? 0 : newIndex;
      this.realm.write(() => {
        const movedObjects = list.data.splice(currentIndex, 1);
        list.data.splice(properIndex, 0, movedObjects[0]);
      });
      this.setState({ rowToHighlight: properIndex, columnToHighlight: 0 });
    }
  };

  public setRowToHighlight = (row: number, column?: number) => {
    this.setState({
      rowToHighlight: row,
      columnToHighlight: column,
    });
  };

  public onSchemaSelected = (name: string, objectToScroll?: any) => {
    const { selectedSchemaName } = this.state;
    if (selectedSchemaName !== name) {
      const rowToHighlight = objectToScroll
        ? this.realm.objects(name).indexOf(objectToScroll)
        : undefined;
      this.setState({
        selectedSchemaName: name,
        list: undefined,
        rowToHighlight,
      });
    }
  };

  public getSelectedSchema = (): Realm.ObjectSchema | null => {
    const { schemas, selectedSchemaName, list } = this.state;

    return (
      schemas.find(
        schema => schema.name === (list ? list.schemaName : selectedSchemaName),
      ) || null
    );
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
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => {
    this.setState({
      rowToHighlight: rowIndex,
      columnToHighlight: columnIndex,
    });

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
    property: Realm.ObjectSchemaProperty,
    value: any,
  ) => {
    if (property.type === 'list') {
      const list = {
        data: value,
        schemaName: property.objectType || '',
        parent: object,
        property,
      };
      this.setState({
        list,
        selectedSchemaName: 'list',
        rowToHighlight: undefined,
        columnToHighlight: undefined,
      });
    } else if (property.type === 'object') {
      if (value) {
        const index = this.realm
          .objects(property.objectType || '')
          .indexOf(value);
        this.setState({
          selectedSchemaName: property.objectType,
          list: undefined,
          rowToHighlight: index,
          columnToHighlight: 0,
        });
      }
    }
  };

  public onCellDoubleClick = (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
  ) => {
    const { list } = this.state;
    if (property.type === 'object' && !list) {
      this.openSelectObject(object, property);
    }
  };

  public onContextMenu = (
    e: React.MouseEvent<any>,
    object: any,
    property: Realm.ObjectSchemaProperty,
  ) => {
    e.preventDefault();

    const { list } = this.state;

    const index = list
      ? list.data.indexOf(object)
      : this.realm.objects(object.objectSchema().name).indexOf(object);

    const actions = [];

    if (list) {
      actions.push({
        label: 'Add object',
        onClick: () => this.openSelectObject(list.parent, list.property),
      });
    }

    if (property.type === 'object' && !list) {
      actions.push({
        label: 'Update reference',
        onClick: () => this.openSelectObject(object, property),
      });
    }

    actions.push({
      label: 'Delete',
      onClick: () => this.openConfirmModal(object),
    });

    this.setState({
      rowToHighlight: index,
      contextMenu: {
        x: e.clientX,
        y: e.clientY,
        object,
        actions,
      },
    });
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
    const { selectObject, list } = this.state;
    if (list) {
      const { parent, property } = list;

      this.realm.write(() => {
        parent[property.name].push(reference);
      });
    } else if (selectObject) {
      const { property, object } = selectObject;

      this.realm.write(() => {
        object[property.name] = reference;
      });
    }
    this.setState({ selectObject: null });
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
    const { list } = this.state;
    if (list) {
      const index = list.data.indexOf(object);
      this.realm.write(() => {
        list.data.splice(index, 1);
      });
    } else {
      this.realm.write(() => this.realm.delete(object));
    }
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
