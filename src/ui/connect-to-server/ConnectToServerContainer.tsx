import * as electron from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { main } from '../../actions/main';
import * as ros from '../../services/ros';
import { showError } from '../reusable/errors';

import { AuthenticationMethod } from './AuthenticationForm';
import { ConnectToServer } from './ConnectToServer';

const MISSING_PARAMS_MESSAGE =
  'Your request did not validate because of missing parameters.';

export class ConnectToServerContainer extends React.Component<
  {},
  {
    isConnecting: boolean;
    method: AuthenticationMethod;
    url: string;
    username: string;
    password: string;
    token: string;
    otherOptions: string;
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
      otherOptions: '',
    };
  }

  public render() {
    return <ConnectToServer {...this.state} {...this} />;
  }

  public onCancel = () => {
    electron.remote.getCurrentWindow().close();
  };

  public onSubmit = async () => {
    this.setState({
      isConnecting: true,
    });

    try {
      const credentials = this.prepareCredentials();
      const user = await ros.authenticate(credentials);
      if (!user.isAdmin) {
        throw new Error('You must be an administrator');
      }
      await main.showServerAdministration({
        credentials,
      });
      electron.remote.getCurrentWindow().close();
    } catch (err) {
      if (err.message === MISSING_PARAMS_MESSAGE) {
        const missingParams = (err.invalid_params || [])
          .filter((params: any) => params.reason)
          .map((param: any) => {
            return ` • ${param.reason}`;
          })
          .join('\n');
        // Replace the error, with a more elaborate one
        err = new Error(`${err.message}\n\n${missingParams}`);
      }
      showError(`Couldn't connect to Realm Object Server`, err, {
        'Failed to fetch':
          'Could not reach the server.\nNote: SSL certificates must be signed by a trusted CA.',
      });
    } finally {
      this.setState({
        isConnecting: false,
      });
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

  public onOtherOptionsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      otherOptions: e.target.value,
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

  private prepareCredentials(): ros.IServerCredentials {
    const { url, method } = this.state;
    const preparedUrl = this.prepareUrl(url);
    if (method === AuthenticationMethod.usernamePassword) {
      const username = this.prepareUsername(this.state.username);
      const password = this.state.password;
      return {
        kind: 'password',
        url: preparedUrl,
        username,
        password,
      };
    } else if (method === AuthenticationMethod.adminToken) {
      const token = this.state.token;
      return {
        kind: 'token',
        url: preparedUrl,
        token,
      };
    } else if (method === AuthenticationMethod.other) {
      try {
        const options = JSON.parse(this.state.otherOptions);
        return {
          kind: 'other',
          url: preparedUrl,
          options,
        };
      } catch (err) {
        if (err instanceof SyntaxError) {
          throw new SyntaxError(`Please provide valid JSON: ${err.message}`);
        } else {
          throw err;
        }
      }
    } else {
      throw new Error(`The method is not supported: ${method}`);
    }
  }
}
