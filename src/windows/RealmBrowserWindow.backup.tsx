import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { Browser } from "../ui/browser/browser";

interface IRealmBrowserWindow {
  realm?: Realm;
}

export class RealmBrowserWindow extends React.Component<{}, IRealmBrowserWindow> {

  constructor() {
    super();
    this.state = {};
  }

  public componentDidMount() {
    electron.ipcRenderer.on("open-file", this.onOpenFile);
    electron.ipcRenderer.on("open-url", this.onOpenUrl);
  }

  public render() {
    return this.state.realm ? <Browser realm={ this.state.realm } /> : <p>Opening ...</p>;
  }

  private onOpenFile = (event: Event, args: { path: string }) => {
    const configuration: Realm.Configuration = {
      path: args.path,
    };
    this.openWithConfiguration(configuration);
  }

  private onOpenUrl = (event: Event, args: { url: string, username: string, password: string }) => {
    const authURL = args.url;

    Realm.Sync.User.login(authURL, args.username, args.password, (error: any, user: Realm.Sync.User) => {
      if (user) {
        const configuration: Realm.Configuration = {
          sync: {
            user,
            url: args.url,
            validate_ssl: false,
          },
        };

        this.openWithConfiguration(configuration);
      } else {
        // TODO: display errors properly
        alert(error);
      }
    });
  }

  private openWithConfiguration = async (configuration: Realm.Configuration) => {
    // TODO: this shouldn't happen so we may consider to throw an exception instead
    if (this.state.realm) {
      this.state.realm.close();
    }

    try {
      const realm = await Realm.open(configuration);
      this.setState({
        realm,
      });
    } catch (e) {
      alert(e);
    }
  }
}
