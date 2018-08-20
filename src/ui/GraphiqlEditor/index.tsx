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

import { Fetcher } from 'graphiql';
import * as React from 'react';
import { Credentials, User } from 'realm-graphql-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { IGraphiqlEditorWindowProps } from '../../windows/WindowProps';
import { showError } from '../reusable/errors';

import { graphQLFetcher } from './graphiql-subscriptions-fetcher';
import { GraphiqlEditor } from './GraphiqlEditor';

type IGraphiqlEditorContainerProps = IGraphiqlEditorWindowProps;

interface IAutenticatingState {
  status: 'authenticating';
}

interface IAuthenticatedState {
  status: 'authenticated';
  user: User;
  fetcher: Fetcher;
}

type IGraphiqlEditorContainerState = IAutenticatingState | IAuthenticatedState;

class GraphiqlEditorContainer extends React.Component<
  IGraphiqlEditorContainerProps,
  IGraphiqlEditorContainerState
> {
  public state: IGraphiqlEditorContainerState = {
    status: 'authenticating',
  };

  public componentDidMount() {
    this.authenticate().then(undefined, err => {
      showError('Failed to authenticate', err);
    });
  }

  public render() {
    return this.state.status === 'authenticated' ? (
      <GraphiqlEditor fetcher={this.state.fetcher} />
    ) : null;
  }

  private async authenticate() {
    const credentials = this.getCredentials();
    const user = await User.authenticate(
      credentials,
      this.props.credentials.url,
    );
    const fetcher = this.createFetcher(user);
    this.setState({
      status: 'authenticated',
      fetcher,
      user,
    });
  }

  private getCredentials() {
    const credentials = this.props.credentials;
    if (credentials.kind === 'password') {
      return Credentials.usernamePassword(
        credentials.username,
        credentials.password,
        false,
      );
    } else if (credentials.kind === 'token') {
      return Credentials.admin(credentials.token);
    } else if (credentials.kind === 'other') {
      const c = new Credentials();
      Object.assign(c, credentials.options);
      return c;
    } else {
      throw new Error(
        `Unexpected kind of credentials: ${(credentials as any).kind}`,
      );
    }
  }

  private getUrl(schema: 'http' | 'ws' = 'http') {
    const encodedPath = encodeURIComponent(this.props.path);
    const url = new URL(`/graphql/${encodedPath}`, this.props.credentials.url);
    if (url.protocol === 'http:' && schema === 'ws') {
      url.protocol = 'ws:';
    } else if (url.protocol === 'https:' && schema === 'ws') {
      url.protocol = 'wss:';
    }
    return url.toString();
  }

  private createFetcher(user: User) {
    const url = this.getUrl('ws');
    const subscriptionsClient = new SubscriptionClient(url, {
      reconnect: true,
      connectionParams: { token: user.token },
    });
    return graphQLFetcher(subscriptionsClient, this.httpFetcher);
  }

  private httpFetcher = (graphQLParams: object) => {
    if (this.state.status === 'authenticated') {
      const url = this.getUrl('http');
      return fetch(url, {
        method: 'post',
        headers: {
          Authorization: this.state.user.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphQLParams),
      }).then(response => response.json());
    } else {
      throw new Error('Graphiql was fetching before authenticated');
    }
  };
}

export { GraphiqlEditorContainer as GraphiqlEditor };
