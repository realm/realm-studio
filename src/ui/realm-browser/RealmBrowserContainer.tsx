import * as assert from "assert";
import * as React from "react";
import * as Realm from "realm";
import * as util from "util";

import {
  IAdminTokenCredentials,
  ILocalRealmBrowserOptions,
  IRealmBrowserOptions,
  ISyncedRealmBrowserOptions,
  IUsernamePasswordCredentials,
  RealmBrowserMode,
} from "../../windows/WindowType";
import {ITab} from "./Tabs";
import {showError} from "../reusable/errors";

import {RealmBrowser} from "./RealmBrowser";

export class RealmBrowserContainer extends React.Component<IRealmBrowserOptions, {
  schemas: Realm.ObjectSchema[];
  selectedTab?: ITab;
  tabs: ITab[];
}> {

  private realm: Realm;

  constructor() {
    super();
    this.state = {
      schemas: [],
      tabs: [],
    };
  }

  public componentDidMount() {
    if (this.props.mode === RealmBrowserMode.Local) {
      const options = this.props as ILocalRealmBrowserOptions;
      assert(options.path, "Missing a path");
      this.initializeLocalRealm(options);
    } else if (this.props.mode === RealmBrowserMode.Synced) {
      const options = this.props as ISyncedRealmBrowserOptions;
      assert(options.serverUrl, "Missing a serverUrl");
      assert(options.path, "Missing a path");
      assert(options.credentials, "Missing credentials");
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

  public getNumberOfObjects = () => {
    const {selectedTab} = this.state;

    if (this.realm && selectedTab) {
      return selectedTab.isList ?
        selectedTab.data.length : this.realm.objects(selectedTab.schemaName).length;
    } else {
      return 0;
    }
  }

  public getObject = (index: number): any => {
    const {selectedTab} = this.state;

    if (this.realm && selectedTab) {
      return selectedTab.isList ?
        selectedTab.data[index] : this.realm.objects(selectedTab.schemaName)[index];
    }
  }

  public getHighlightRowIndex = (): number | null => {
    const {selectedTab} = this.state;

    if (selectedTab && !selectedTab.isList && !util.isNullOrUndefined(selectedTab.data)) {
      return this.realm
        .objects(selectedTab.schemaName)
        .findIndex(object => util.inspect(object) === util.inspect(selectedTab.data));
    } else {
      return null;
    }
  }

  public onCellChange = (object: any, propertyName: string, value: string) => {
    if (this.realm && object) {
      this.realm.write(() => {
        // TODO: Apply the various data parsings and transformations, based on the type
        object[propertyName] = value;
      });
    }
  }

  public onSchemaSelected = (name: string) => {
    const newTab = {
      data: null,
      schemaName: name,
      associatedObject: null,
      id: this.state.tabs.length,
      isList: false,
    };

    this.addTab(newTab);
  }

  public getSelectedSchema = (): Realm.ObjectSchema | null => {
    const {schemas, selectedTab} = this.state;

    return schemas.find((schema) => schema.name === (selectedTab && selectedTab.schemaName)) || null;
  }

  public onTabSelected = (index: number) => {
    const {tabs} = this.state;
    const newTab = tabs.find((t) => t.id === index);
    this.setState({
      selectedTab: newTab,
    });
  }

  public populateSidebar = () => {
    const {schemas} = this.state;
    if (schemas) {
      return schemas.map((schema) => ({
        name: schema.name,
        length: this.realm.objects(name).length,
      }));
    } else {
      return [];
    }
  }

  public getSchemaLength = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  }

  public onListCellClick = (object: any, property: Realm.ObjectSchemaProperty, value: any) => {
    const newTab = {
      data: value,
      schemaName: property.objectType || '',
      associatedObject: property.type === "list" ? object : null,
      id: this.state.tabs.length,
      isList: property.type === "list",
    };

    this.addTab(newTab);
  }

  private addTab = (tabToAdd: ITab) => {
    const {tabs} = this.state;
    const tabAlreadyCreated = tabs.find(tab => (!tabToAdd.isList && tab.schemaName === tabToAdd.schemaName &&
      util.isNull(tab.associatedObject)) || (tabToAdd.isList && tab.schemaName === tabToAdd.schemaName &&
      util.inspect(tab.associatedObject) === util.inspect(tabToAdd.associatedObject))
    );

    if (tabAlreadyCreated) {
      this.setState({
        selectedTab: {
          ...tabAlreadyCreated,
          data: tabToAdd.data,
        },
      });
    } else {
      this.setState({
        selectedTab: tabToAdd,
        tabs: [...tabs, tabToAdd],
      });
    }

  }

  private async initializeLocalRealm(options: ILocalRealmBrowserOptions) {
    this.realm = await Realm.open({
      path: options.path,
    });
    const firstSchemaName = this.realm.schema.length > 0 ? this.realm.schema[0].name : undefined;
    this.setState({
      schemas: this.realm.schema
    });
    firstSchemaName && this.onSchemaSelected(firstSchemaName);
    this.addRealmChangeListener();
  }

  private async initializeSyncedRealm(options: ISyncedRealmBrowserOptions) {
    const user = await this.getUser(options);

    const serverUrl = new URL(options.serverUrl);
    serverUrl.protocol = "realm:";

    // Remove the initial slash from the path, if any
    const path = options.path.indexOf("/") === 0 ? options.path.slice(1) : options.path;
    const url = serverUrl.toString() + path;

    this.realm = await Realm.open({
      sync: {
        url,
        user,
        validate_ssl: false,
      },
    });

    const firstSchemaName = this.realm.schema.length > 0 ? this.realm.schema[0].name : undefined;
    this.setState({
      schemas: this.realm.schema
    });
    firstSchemaName && this.onSchemaSelected(firstSchemaName);
    this.addRealmChangeListener();
  }

  private async getUser(options: ISyncedRealmBrowserOptions): Promise<Realm.Sync.User> {
    return new Promise<Realm.Sync.User>((resolve, reject) => {
      if ("token" in options.credentials) {
        const credentials = options.credentials as IAdminTokenCredentials;
        const user = Realm.Sync.User.adminUser(credentials.token, options.serverUrl);
        resolve(user);
      } else if ("username" in options.credentials && "password" in options.credentials) {
        const credentials = options.credentials as IUsernamePasswordCredentials;
        Realm.Sync.User.login(options.serverUrl, credentials.username, credentials.password, (err, user) => {
          if (err) {
            showError(`Couldn't connect to Realm Object Server`, err, {
              "Failed to fetch": "Could not reach the server",
            });
          } else {
            resolve(user);
          }
        });
      }
    });
  }

  private addRealmChangeListener() {
    if (this.realm) {
      this.realm.addListener("change", this.onRealmChanged);
    }
  }

  private removeRealmChangeListener() {
    if (this.realm) {
      this.realm.removeListener("change", this.onRealmChanged);
    }
  }

  private onRealmChanged = () => {
    this.forceUpdate();
  }

}
