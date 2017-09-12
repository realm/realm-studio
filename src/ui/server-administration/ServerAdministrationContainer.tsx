import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { showRealmBrowser } from "../../actions";
import {
  IAdminTokenCredentials,
  IServerAdministrationOptions,
  ISyncedRealmBrowserOptions,
  IUsernamePasswordCredentials,
  RealmBrowserMode,
} from "../../windows/WindowType";
import { showError } from "../reusable/errors";

import { ServerAdministration, Tab } from "./ServerAdministration";

export class ServerAdministrationContainer extends React.Component<IServerAdministrationOptions, {
  activeTab: Tab,
  user: Realm.Sync.User | null,
}> {

  constructor() {
    super();
    this.state = {
      activeTab: Tab.Realms,
      user: null,
    };
  }

  public componentDidMount() {
    if ("token" in this.props.credentials) {
      const credentials = this.props.credentials as IAdminTokenCredentials;
      const user = Realm.Sync.User.adminUser(credentials.token, this.props.url);
      this.setState({ user });
    } else if ("username" in this.props.credentials && "password" in this.props.credentials) {
      const credentials = this.props.credentials as IUsernamePasswordCredentials;
      Realm.Sync.User.login(this.props.url, credentials.username, credentials.password, (err, user) => {
        if (err) {
          showError(`Couldn't connect to Realm Object Server`, err, {
            "Failed to fetch": "Could not reach the server",
          });
        } else {
          this.setState({ user });
        }
      });
    }
  }

  public render() {
    return <ServerAdministration {...this.state} {...this} />;
  }

  // TODO: Once the user serializes better, this method should be moved to the ./realms/RealmsTableContainer.tsx
  public onRealmOpened = (path: string) => {
    showRealmBrowser({
      mode: RealmBrowserMode.Synced,
      url: `${this.props.url}${path}`,
      credentials: this.props.credentials,
    } as ISyncedRealmBrowserOptions);
  }

  public onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
  }
}
