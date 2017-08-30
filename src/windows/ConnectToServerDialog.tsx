import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

export class ConnectToServerDialog extends React.Component<{}, {}> {

  constructor() {
    super();
    this.state = {};
  }

  public render() {
    return (
      <h1>Connect to server ...</h1>
    );
  }
}
