import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { showServerAdministration } from "../../actions";

import { Greeting } from "./Greeting";

export class GreetingContainer extends React.Component<{}, {
  version: string,
}> {

  constructor() {
    super();
    this.state = {
      version: process.env.REALM_STUDIO_VERSION || "unknown",
    };
  }

  public render() {
    return <Greeting {...this.state} />;
  }

}
