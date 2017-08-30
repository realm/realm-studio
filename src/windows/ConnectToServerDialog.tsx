import * as React from "react";

import { ConnectToServerContainer } from "../ui/connect-to-server/ConnectToServerContainer";

import "./ConnectToServerDialog.scss";

export class ConnectToServerDialog extends React.Component<{}, {}> {

  constructor() {
    super();
    this.state = {};
  }

  public render() {
    return (
      <ConnectToServerContainer />
    );
  }
}
