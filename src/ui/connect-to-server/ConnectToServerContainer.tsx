import * as React from "react";
import * as Realm from "realm";

import { showError } from "../errors";

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

  public onSubmit = async () => {
    const { url, username, password } = this.state;

    const preparedUrl = this.prepareUrl(url);

    this.setState({
      isConnecting: true,
    });

    Realm.Sync.User.login(preparedUrl, username, password, (err, user) => {
      this.setState({
        isConnecting: false,
      });

      if (err) {
        showError(`Couldn't connect to Realm Object Server`, err, {
          "Failed to fetch": "Could not reach the server",
        });
      } else {
        // TODO: Tell the main process that we can connect
        console.log(`Logged in as ${user}`, user);
      }
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

  private prepareUrl(url: string) {
    if (url.indexOf("http") !== 0) {
      return `http://${url}`;
    } else {
      return url;
    }
  }
}
