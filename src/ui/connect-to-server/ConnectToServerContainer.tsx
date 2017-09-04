import * as electron from "electron";
import * as React from "react";
import * as Realm from "realm";

import { showServerAdministration } from "../../actions";
import { showError } from "../reusable/errors";

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
    electron.remote.getCurrentWindow().close();
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
        // Show the server administration
        showServerAdministration({
          url: user.server,
          username,
          password,
        });
        // and close this window
        electron.remote.getCurrentWindow().close();
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
