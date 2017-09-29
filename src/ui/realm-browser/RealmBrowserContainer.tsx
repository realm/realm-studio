import * as assert from 'assert';
import * as React from 'react';
import * as Realm from 'realm';
import * as util from 'util';

import {
  IAdminTokenCredentials,
  ILocalRealmBrowserOptions,
  IRealmBrowserOptions,
  ISyncedRealmBrowserOptions,
  IUsernamePasswordCredentials,
  RealmBrowserMode,
} from '../../windows/WindowType';
import { IContextMenuAction } from '../reusable/context-menu';
import { showError } from '../reusable/errors';

import { RealmBrowser } from './RealmBrowser';

export interface IList {
  data: Realm.Results<any>;
  schemaName: string;
  parent: Realm.Object;
  property: Realm.ObjectSchemaProperty | any;
}

export interface IState {
  schemas: Realm.ObjectSchema[];
  list: IList | null;
  selectedSchemaName?: string | null;
  rowToHighlight: number | null;
  confirmModal: {
    yes: () => void;
    no: () => void;
  } | null;
  contextMenu: {
    x: number;
    y: number;
    object: any;
    actions: IContextMenuAction[];
  } | null;
  selectObject?: {
    schema: Realm.ObjectSchema | null;
    data: Realm.Results<any> | any;
    property: any;
    schemaName: string;
    object: any;
    optional: boolean;
  } | null;
}

export class RealmBrowserContainer extends React.Component<
  IRealmBrowserOptions,
  IState
> {
  private realm: Realm;
  private clickTimeout?: any;

  constructor() {
    super();
    this.state = {
      schemas: [],
      list: null,
      selectedSchemaName: null,
      rowToHighlight: null,
      contextMenu: null,
      confirmModal: null,
      selectObject: null,
    };
  }

  public componentDidMount() {
    if (this.props.mode === RealmBrowserMode.Local) {
      const options = this.props as ILocalRealmBrowserOptions;
      assert(options.path, 'Missing a path');
      this.initializeLocalRealm(options);
    } else if (this.props.mode === RealmBrowserMode.Synced) {
      const options = this.props as ISyncedRealmBrowserOptions;
      assert(options.serverUrl, 'Missing a serverUrl');
      assert(options.path, 'Missing a path');
      assert(options.credentials, 'Missing credentials');
      this.initializeSyncedRealm(this.props as ISyncedRealmBrowserOptions);
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

  public onSchemaSelected = (name: string, objectToScroll?: any) => {
    const { selectedSchemaName } = this.state;
    if (selectedSchemaName !== name) {
      const rowToHighlight = objectToScroll
        ? this.realm.objects(name).indexOf(objectToScroll)
        : null;
      this.setState({ selectedSchemaName: name, list: null, rowToHighlight });
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
    index: number,
  ) => {
    this.setState({ rowToHighlight: index });

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
      this.setState({ list, selectedSchemaName: 'list', rowToHighlight: null });
    } else if (property.type === 'object') {
      if (value) {
        const index = this.realm
          .objects(property.objectType || '')
          .indexOf(value);
        this.setState({
          selectedSchemaName: property.objectType,
          list: null,
          rowToHighlight: index,
        });
      }
    }
  };

  public onCellDoubleClick = (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
  ) => {
    if (property.type === 'object') {
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

    const actions = [
      {
        label: 'Delete',
        onClick: () => this.openConfirmModal(object),
      },
    ];

    if (property.type === 'object') {
      actions.push({
        label: 'Update reference',
        onClick: () => this.openSelectObject(object, property),
      });
    }

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
        no: () => this.setState({ confirmModal: null }),
      },
    });
  };

  public deleteObject = (object: Realm.Object) => {
    this.realm.write(() => this.realm.delete(object));
    this.setState({ rowToHighlight: null, confirmModal: null });
  };

  public onContextMenuClose = (): void => {
    this.setState({ contextMenu: null });
  };

  private async initializeLocalRealm(options: ILocalRealmBrowserOptions) {
    this.realm = await Realm.open({
      path: options.path,
    });
    const firstSchemaName =
      this.realm.schema.length > 0 ? this.realm.schema[0].name : undefined;
    this.setState({
      schemas: this.realm.schema,
    });
    if (firstSchemaName) {
      this.onSchemaSelected(firstSchemaName);
    }
    this.addRealmChangeListener();
  }

  private async initializeSyncedRealm(options: ISyncedRealmBrowserOptions) {
    const user = await this.getUser(options);

    const serverUrl = new URL(options.serverUrl);
    serverUrl.protocol = 'realm:';

    // Remove the initial slash from the path, if any
    const path =
      options.path.indexOf('/') === 0 ? options.path.slice(1) : options.path;
    const url = serverUrl.toString() + path;

    this.realm = await Realm.open({
      sync: {
        url,
        user,
        validate_ssl: false,
      },
    });

    const firstSchemaName =
      this.realm.schema.length > 0 ? this.realm.schema[0].name : undefined;
    this.setState({
      schemas: this.realm.schema,
    });
    if (firstSchemaName) {
      this.onSchemaSelected(firstSchemaName);
    }
    this.addRealmChangeListener();
  }

  private async getUser(
    options: ISyncedRealmBrowserOptions,
  ): Promise<Realm.Sync.User> {
    return new Promise<Realm.Sync.User>(async (resolve, reject) => {
      if ('token' in options.credentials) {
        const credentials = options.credentials as IAdminTokenCredentials;
        const user = Realm.Sync.User.adminUser(
          credentials.token,
          options.serverUrl,
        );
        resolve(user);
      } else if (
        'username' in options.credentials &&
        'password' in options.credentials
      ) {
        const credentials = options.credentials as IUsernamePasswordCredentials;
        try {
          const user = await Realm.Sync.User.login(
            options.serverUrl,
            credentials.username,
            credentials.password,
          );
          resolve(user);
        } catch (err) {
          showError(`Couldn't connect to Realm Object Server`, err, {
            'Failed to fetch': 'Could not reach the server',
          });
          reject(err);
        }
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

  private onRealmChanged = () => {
    this.forceUpdate();
  };
}
