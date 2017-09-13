import * as assert from "assert";
import * as React from "react";
import * as Realm from "realm";

import {
  ILocalRealmBrowserOptions,
  IRealmBrowserOptions,
  ISyncedRealmBrowserOptions,
  RealmBrowserMode,
} from "../../windows/WindowType";

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
      assert(options.url, "Missing a url");
      assert(options.credentials, "Missing credentials");
      this.initializeSyncedRealm(this.props as ISyncedRealmBrowserOptions);
    }
  }

  public componentWillUnmount() {
    this.removeRealmChangeListener();
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
    //
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
