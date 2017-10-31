import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../actions/main';
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
      await main.showServerAdministration({
        credentials: {
          url: preparedUrl,
          token,
        },
      });
      this.setState({
        isConnecting: false,
      });
    } else {
      try {
        const user = await Realm.Sync.User.login(
          preparedUrl,
          preparedUsername,
          password,
        );
        // Show the server administration
        await main.showServerAdministration({
          credentials: {
            url: user.server,
            username: preparedUsername,
            password,
          },
        });
        // and close this window
        electron.remote.getCurrentWindow().close();
      } catch (err) {
        const sslWarning =
          preparedUrl.indexOf('https:') === 0
            ? '\nNote: SSL certificates should be signed by a trusted CA.'
            : '';
        showError(`Couldn't connect to Realm Object Server`, err, {
          'Failed to fetch': 'Could not reach the server.' + sslWarning,
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

  private prepareUrl(urlString: string) {
    if (urlString === '') {
      return 'http://localhost:9080';
    } else {
      const url = new URL(urlString);
      // Replace the realm: with http:
      if (url.protocol === 'realm:') {
        url.protocol = 'http:';
      }
      // Set the default ports
      if (url.protocol === 'http:' && !url.port) {
        url.port = '9080';
      }
      if (url.protocol === 'https:' && !url.port) {
        url.port = '9443';
      }
      return url.toString();
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
