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
  schemas: Realm.ObjectSchema[],
  selectedSchemaName: string | null,
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

  public render() {
    return <RealmBrowser {...this.state} {...this} />;
  }

  public getColumnWidth = (index: number) => {
    return 100;
  }

  public getNumberOfObjects = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  }

  public getObject = (index: number) => {
    if (this.state.selectedSchemaName) {
      const objects = this.realm.objects(this.state.selectedSchemaName);
      return objects[index];
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
    this.setState({
      schemas: this.realm.schema,
      selectedSchemaName: this.realm.schema.length > 0 ? this.realm.schema[0].name : null,
    });
  }

  private async initializeSyncedRealm(options: ISyncedRealmBrowserOptions) {
    //
  }

}
