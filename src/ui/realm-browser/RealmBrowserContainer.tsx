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
}> {

  private realm: Realm;

  constructor() {
    super();
    this.state = {
      schemas: [],
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

  public getNumberOfObjects = (name: string) => {
    if (this.realm) {
      return this.realm.objects(name).length;
    } else {
      return 0;
    }
  }

  private async initializeLocalRealm(options: ILocalRealmBrowserOptions) {
    this.realm = await Realm.open({
      path: options.path,
    });
    this.setState({
      schemas: this.realm.schema,
    });
  }

  private async initializeSyncedRealm(options: ISyncedRealmBrowserOptions) {
    //
  }

}
