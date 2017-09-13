import * as assert from "assert";
import * as React from "react";
import * as Realm from "realm";

import {
  IAdminTokenCredentials,
  ILocalRealmBrowserOptions,
  IRealmBrowserOptions,
  ISyncedRealmBrowserOptions,
  IUsernamePasswordCredentials,
  RealmBrowserMode,
} from "../../windows/WindowType";
import { showError } from "../reusable/errors";

import { RealmBrowser } from "./RealmBrowser";

export class RealmBrowserContainer extends React.Component<IRealmBrowserOptions, {
  schemas: Realm.ObjectSchema[];
  selectedSchemaName: string | null;
}> {

  private realm: Realm;

  constructor() {
    super();
    this.state = {
      schemas: [],
      selectedSchemaName: null,
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

  public getNumberOfObjects = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  }

  public getObject = (index: number): any => {
    if (this.state.selectedSchemaName) {
      const objects = this.realm.objects(this.state.selectedSchemaName);
      return objects[index];
    }
  }

  public onCellChange = (index: number, propertyName: string, value: string) => {
    if (this.realm) {
      const selectedSchema = this.realm.schema.find((schema) => schema.name === this.state.selectedSchemaName);
      if (selectedSchema) {
        const object = this.getObject(index);
        const property = selectedSchema.properties[propertyName];
        if (object) {
          this.realm.write(() => {
            // TODO: Apply the various data parsings and transformations, based on the type
            object[propertyName] = value;
          });
        }
      }
    }
  }

  public onSchemaSelected = (name: string) => {
    this.setState({
      selectedSchemaName: name,
    });
  }

  private async initializeLocalRealm(options: ILocalRealmBrowserOptions) {
    this.realm = await Realm.open({
      path: options.path,
    });
    const firstSchemaName = this.realm.schema.length > 0 ? this.realm.schema[0].name : null;
    this.setState({
      schemas: this.realm.schema,
      selectedSchemaName: firstSchemaName,
    });
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

    const firstSchemaName = this.realm.schema.length > 0 ? this.realm.schema[0].name : null;
    this.setState({
      schemas: this.realm.schema,
      selectedSchemaName: firstSchemaName,
    });
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
