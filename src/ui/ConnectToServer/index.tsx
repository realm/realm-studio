////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as electron from 'electron';
import * as json5 from 'json5';
import * as React from 'react';

import { main } from '../../actions/main';
import {
  getCredentials,
  setCredentials,
  unsetCredentials,
} from '../../services/keytar';
import * as ros from '../../services/ros';
import { showError } from '../reusable/errors';

import { AuthenticationMethod } from './AuthenticationForm';
import { ConnectToServer } from './ConnectToServer';

const MISSING_PARAMS_MESSAGE =
  'Your request did not validate because of missing parameters.';

interface IConnectToServerContainerProps {
  url?: string;
}

interface IConnectToServerContainerState {
  isConnecting: boolean;
  method: AuthenticationMethod;
  url: string;
  username: string;
  password: string;
  token: string;
  otherOptions: string;
  saveCredentials: boolean;
}

class ConnectToServerContainer extends React.Component<
  IConnectToServerContainerProps,
  IConnectToServerContainerState
> {
  public state: IConnectToServerContainerState = {
    isConnecting: false,
    method: AuthenticationMethod.usernamePassword,
    url: '',
    username: '',
    password: '',
    token: '',
    otherOptions: '',
    saveCredentials: false,
  };

  public render() {
    return <ConnectToServer {...this.state} {...this} />;
  }

  public componentDidMount() {
    const url = this.props.url || this.getLatestUrl() || '';
    this.setState({
      url,
    });
    this.restoreCredentials(url);
  }

  public componentDidUpdate(
    prevProps: {},
    prevState: IConnectToServerContainerState,
  ) {
    if (this.state.url !== prevState.url) {
      this.restoreCredentials(this.state.url);
    }
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
      const user = await ros.users.authenticate(credentials);
      if (!user.isAdmin) {
        throw new Error('You must be an administrator');
      }
      if (this.state.saveCredentials) {
        await setCredentials(credentials);
      } else {
        await unsetCredentials(credentials.url);
      }
      this.setLatestUrl(credentials.url);
      await main.showServerAdministration({
        credentials,
        validateCertificates: true,
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
        'Failed to fetch': 'Could not reach the server.',
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

  public onSaveCredentialsChanged = (saveCredentials: boolean) => {
    this.setState({
      saveCredentials,
    });
  };

  private prepareUrl(urlString: string) {
    if (urlString === '') {
      return 'http://localhost:9080/';
    } else {
      try {
        if (urlString.indexOf('://') === -1) {
          // If there is no "://", we assume the user forgot the protocol
          urlString = `http://${urlString}`;
        }
        const url = new URL(urlString);
        // Replace the realm: with http:
        if (!url.protocol || url.protocol === 'realm:') {
          url.protocol = 'http:';
        } else if (url.protocol === 'realms:') {
          url.protocol = 'https:';
        }
        return url.toString();
      } catch (err) {
        if (err.message.indexOf(`Failed to construct 'URL'`) >= 0) {
          // Return null, if the URL does not parse
          return null;
        } else {
          throw err;
        }
      }
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
    if (!preparedUrl) {
      throw new Error(`Couldn't prepare credentials, the URL is malformed.`);
    }
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
        const options = json5.parse(this.state.otherOptions);
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

  private getMethodFromCredentials(credentials: ros.IServerCredentials) {
    if (credentials.kind === 'password') {
      return AuthenticationMethod.usernamePassword;
    } else if (credentials.kind === 'token') {
      return AuthenticationMethod.adminToken;
    } else if (credentials.kind === 'other') {
      return AuthenticationMethod.other;
    } else {
      throw new Error('Unexpected authentication method');
    }
  }

  private async restoreCredentials(url: string) {
    const preparedUrl = this.prepareUrl(url);
    const credentials = await getCredentials(preparedUrl);
    if (credentials) {
      const method = this.getMethodFromCredentials(credentials);
      // The default state is to reset everything
      const state: any = {
        method,
        username: '',
        password: '',
        token: '',
        otherOptions: '',
        saveCredentials: true,
      };
      if (credentials.kind === 'password') {
        state.username = credentials.username;
        state.password = credentials.password;
      } else if (credentials.kind === 'token') {
        state.token = credentials.token;
      } else if (credentials.kind === 'other') {
        state.otherOptions = JSON.stringify(credentials.options, undefined, 2);
      }
      this.setState(state);
    } else {
      this.setState({
        saveCredentials: false,
      });
    }
  }

  private setLatestUrl(url: string) {
    localStorage.setItem('latest-ros-url', url);
  }

  private getLatestUrl() {
    return localStorage.getItem('latest-ros-url') || '';
  }
}

export { ConnectToServerContainer as ConnectToServer };
