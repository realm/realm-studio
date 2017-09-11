import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { showServerAdministration } from "../../actions";

import { Greeting } from "./Greeting";

export class GreetingContainer extends React.Component<{}, {}> {

  constructor() {
    super();
    this.state = {};
  }

  public render() {
    return <Greeting {...this.state} {...this} />;
  }

}
