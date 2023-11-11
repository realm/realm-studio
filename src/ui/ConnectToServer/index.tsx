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

/*
import electron from 'electron';
import json5 from 'json5';
*/
import React from 'react';
import { App, Credentials } from 'realm';
import electron from '@electron/remote';

import { main } from '../../actions/main';
import { showError } from '../reusable/errors';
import { RealmLoadingMode } from '../../utils/realms';

import { AuthenticationMethod } from './AuthenticationForm';
import { ConnectToServer } from './ConnectToServer';

/*
const MISSING_PARAMS_MESSAGE =
  'Your request did not validate because of missing parameters.';
const INVALID_PARAMS_MESSAGE = 'Your request parameters did not validate.';
*/

interface IConnectToServerContainerProps {
  url?: string;
}

interface IConnectToServerContainerState {
  isConnecting: boolean;
  method: AuthenticationMethod;
  appId: string;
  url: string;
  email: string;
  password: string;
  apiKey: string;
  token: string;
  saveCredentials: boolean;
}

class ConnectToServerContainer extends React.Component<
  IConnectToServerContainerProps,
  IConnectToServerContainerState
> {
  public state: IConnectToServerContainerState = {
    isConnecting: false,
    method: AuthenticationMethod.anonymous,
    appId: '',
    url: '',
    email: '',
    password: '',
    apiKey: '',
    token: '',
    saveCredentials: false,
  };

  public render() {
    return <ConnectToServer {...this.state} {...this} />;
  }

  public componentDidMount() {
    // TODO: XXX
    /*
    const url = this.props.url || this.getLatestUrl() || '';
    this.setState({
      url,
    });
    this.restoreCredentials(url);
    */
  }

  public componentDidUpdate(
    prevProps: unknown,
    prevState: IConnectToServerContainerState,
  ) {
    // TODO: XXX
    /*
    if (this.state.url !== prevState.url) {
      this.restoreCredentials(this.state.url);
    }
    */
  }

  public onCancel = () => {
    electron.getCurrentWindow().close();
  };

  public onSubmit = async () => {
    this.setState({
      isConnecting: true,
    });

    try {
      const { appId, url } = this.state;
      // Use SDK default (passing undefined) on an empty string.
      const baseUrl = url.length === 0 ? undefined : url;
      const app = new App({ id: appId, baseUrl });
      const credentials = this.prepareCredentials();
      await app.logIn(credentials);

      // TODO: XXX
      /*
      if (this.state.saveCredentials) {
        await setCredentials(credentials);
      } else {
        await unsetCredentials(credentials.url);
      }
      this.setLatestUrl(credentials.url);
      */
      await main.showRealmBrowser({
        realm: {
          mode: RealmLoadingMode.Synced,
          serverUrl: this.state.url,
          appId: this.state.appId,
          credentials,
        },
      });
      electron.getCurrentWindow().close();
    } catch (err) {
      showError(`Couldn't connect to Atlas App Services`, err, {
        'Failed to fetch': 'Could not reach the server.',
      });
    } finally {
      this.setState({
        isConnecting: false,
      });
    }
  };

  public onAppIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      appId: e.target.value,
    });
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

  public onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: e.target.value,
    });
  };

  public onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  public onApiKeyChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      apiKey: e.target.value,
    });
  };

  public onTokenChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      token: e.target.value,
    });
  };

  public onSaveCredentialsChanged = (saveCredentials: boolean) => {
    this.setState({
      saveCredentials,
    });
  };

  /*
  private prepareUrl(urlString: string) {
    if (urlString === '') {
      return 'https://realm.mongodb.com/';
    } else {
      try {
        if (urlString.indexOf('://') === -1) {
          // If there is no "://", we assume the user forgot the protocol
          urlString = `https://${urlString}`;
        }
        const url = new URL(urlString);
        return url.toString();
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.indexOf(`Failed to construct 'URL'`) >= 0
        ) {
          // Return null, if the URL does not parse
          return null;
        } else {
          throw err;
        }
      }
    }
  }
  */

  private prepareCredentials(): Credentials {
    const { method } = this.state;
    switch (method) {
      case AuthenticationMethod.anonymous:
        return Credentials.anonymous();
      case AuthenticationMethod.emailPassword:
        return Credentials.emailPassword(this.state.email, this.state.password);
      case AuthenticationMethod.apiKey:
        return Credentials.apiKey(this.state.apiKey);
      case AuthenticationMethod.jwt:
        return Credentials.jwt(this.state.token);
      default:
        throw new Error(`The method is not supported: ${method}`);
    }
  }

  /*
  private getMethodFromCredentials(credentials: ros.IServerCredentials) {
    switch (credentials.kind) {
      case 'password':
        return AuthenticationMethod.usernamePassword;
      case 'token':
        return AuthenticationMethod.adminToken;
      case 'other':
        return AuthenticationMethod.other;
      case 'jwt':
        return AuthenticationMethod.jwt;
      default:
        throw new Error('Unexpected authentication method');
    }
  }

  private async restoreCredentials(url: string) {
    const preparedUrl = this.prepareUrl(url);
    const credentials = await getCredentials(preparedUrl);
    if (credentials) {
      const method = this.getMethodFromCredentials(credentials);
      // The default state is to reset everything
      const state = {
        method,
        username: '',
        password: '',
        token: '',
        otherOptions: '',
        saveCredentials: true,
        providerName: '',
      };

      if (credentials.kind === 'password') {
        state.username = credentials.username;
        state.password = credentials.password;
      } else if (credentials.kind === 'token') {
        state.token = credentials.token;
      } else if (credentials.kind === 'other') {
        state.otherOptions = JSON.stringify(credentials.options, undefined, 2);
      } else if (credentials.kind === 'jwt') {
        state.token = credentials.token;
        state.providerName = credentials.providerName;
      }

      this.setState(state);
    } else {
      this.setState({
        saveCredentials: false,
      });
    }
  }
  */

  /*
  private setLatestUrl(url: string) {
    localStorage.setItem('latest-ros-url', url);
  }

  private getLatestUrl() {
    return localStorage.getItem('latest-ros-url') || '';
  }
  */
}

export { ConnectToServerContainer as ConnectToServer };
