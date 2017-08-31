import * as React from "react";
import * as Realm from "realm";

import ConnectToServer from "./ConnectToServer";

export class ConnectToServerContainer extends React.Component<{}, {
  url: string,
  username: string,
  password: string,
  isConnecting: boolean,
}> {

  constructor() {
    super();
    this.state = {
      url: "",
      username: "",
      password: "",
      isConnecting: false,
    };
  }

  public render() {
    return <ConnectToServer {...this.state} {...this} />;
  }

  public onCancel = () => {
    // TODO: Close the window
  }

  public onSubmit = () => {
    // TODO: Try connecting to ROS
    console.log(`Trying to connect to ROS: ${this.state.url} (${this.state.username}/${this.state.password})`);
    this.setState({
      isConnecting: true,
    });
  }

  public onUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      url: e.target.value,
    });
  }

  public onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: e.target.value,
    });
  }

  public onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  }
}
