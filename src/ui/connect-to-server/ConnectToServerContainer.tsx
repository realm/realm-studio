import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { showServerAdministration } from '../../actions';
import { showError } from '../reusable/errors';

import { AuthenticationMethod } from './AuthenticationForm';
import { ConnectToServer } from './ConnectToServer';

export class ConnectToServerContainer extends React.Component<
  {},
  {
    isConnecting: boolean;
    method: AuthenticationMethod;
    url: string;
    username: string;
    password: string;
    token: string;
  }
> {
  constructor() {
    super();
    this.state = {
      isConnecting: false,
      method: AuthenticationMethod.usernamePassword,
      url: '',
      username: '',
      password: '',
      token: '',
    };
  }

  public render() {
    return <ConnectToServer {...this.state} {...this} />;
  }

  public onCancel = () => {
    electron.remote.getCurrentWindow().close();
  };

  public onSubmit = async () => {
    const { url, username, password, token } = this.state;

    const preparedUrl = this.prepareUrl(url);
    const preparedUsername = this.prepareUsername(username);

    this.setState({
      isConnecting: true,
    });

    if (token) {
      showServerAdministration({
        url: preparedUrl,
        credentials: {
          token,
        },
      });
    } else {
      try {
        const user = await Realm.Sync.User.login(
          preparedUrl,
          preparedUsername,
          password,
        );
        // Show the server administration
        showServerAdministration({
          url: user.server,
          credentials: {
            username: preparedUsername,
            password,
          },
        });
        // and close this window
        electron.remote.getCurrentWindow().close();
      } catch (err) {
        showError(`Couldn't connect to Realm Object Server`, err, {
          'Failed to fetch': 'Could not reach the server',
        });
      } finally {
        this.setState({
          isConnecting: false,
        });
      }
    }
  };

  public onUrlChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      url: e.target.value,
    });
  };

  public onMethodChanged = (method: AuthenticationMethod) => {
    this.setState({
      method,
    });
  };

  public onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: e.target.value,
    });
  };

  public onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  public onTokenChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      token: e.target.value,
    });
  };

  private prepareUrl(url: string) {
    if (url === '') {
      return 'http://localhost:9080';
    } else if (url.indexOf('http') !== 0) {
      return `http://${url}`;
    } else {
      return url;
    }
  }

  private prepareUsername(username: string) {
    if (username === '') {
      return 'realm-admin';
    } else {
      return username;
    }
  }
}
