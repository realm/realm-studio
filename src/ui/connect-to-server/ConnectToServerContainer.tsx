import * as React from "react";
import * as Realm from "realm";

import ConnectToServer from "./ConnectToServer";

export class ConnectToServerContainer extends React.Component<{}, {}> {

  constructor() {
    super();
    this.state = {};
  }

  public render() {
    return <ConnectToServer />;
  }
}
