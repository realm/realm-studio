import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { showServerAdministration } from "../../actions";
import { showError } from "../reusable/errors";

import { ServerAdministration, Tab } from "./ServerAdministration";

export class ServerAdministrationContainer extends React.Component<{
  url: string,
  username: string,
  password: string,
}, {
  activeTab: Tab,
  user: Realm.Sync.User | null,
}> {

  constructor() {
    super();
    this.state = {
      activeTab: Tab.Users,
      user: null,
    };
  }

  public componentDidMount() {
    Realm.Sync.User.login(this.props.url, this.props.username, this.props.password, (err, user) => {
      if (err) {
        showError(`Couldn't connect to Realm Object Server`, err, {
          "Failed to fetch": "Could not reach the server",
        });
      } else {
        this.setState({ user });
      }
    });
  }

  public render() {
    return <ServerAdministration {...this.state} {...this} />;
  }

  public onTabChanged = (tab: Tab) => {
    this.setState({
      activeTab: tab,
    });
  }
}
