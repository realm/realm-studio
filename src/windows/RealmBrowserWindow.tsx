import * as React from "react";

import { RealmBrowserContainer } from "../ui/realm-browser/RealmBrowserContainer";
import { IRealmBrowserOptions } from "./WindowType";

// TODO: Consider if we can have the window not show before a connection has been established.

export class RealmBrowserWindow extends React.Component<{
  options: IRealmBrowserOptions,
}, {}> {

  public render() {
    return (
      <RealmBrowserContainer {...this.props.options} />
    );
  }
}
