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

import * as React from 'react';
import { Credentials, User } from 'realm-graphql-client';

import { IGraphiqlEditorWindowProps } from '../../windows/WindowProps';
import { showError } from '../reusable/errors';

import { GraphiqlEditor } from './GraphiqlEditor';

type IGraphiqlEditorContainerProps = IGraphiqlEditorWindowProps;

interface IGraphiqlEditorContainerState {
  user?: User;
}

class GraphiqlEditorContainer extends React.Component<
  IGraphiqlEditorContainerProps,
  IGraphiqlEditorContainerState
> {
  public state: IGraphiqlEditorContainerState = {};

  public componentDidMount() {
    this.authenticate().then(undefined, err => {
      showError('Failed to authenticate', err);
    });
  }

  public render() {
    return this.state.user ? <GraphiqlEditor fetcher={this.fetcher} /> : null;
  }

  private async authenticate() {
    const credentials = this.getCredentials();
    const user = await User.authenticate(
      credentials,
      this.props.credentials.url,
    );
    this.setState({
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

  private fetcher = (graphQLParams: object) => {
    if (this.state.user) {
      const encodedPath = encodeURI(this.props.path);
      const url = new URL(
        `/graphql/${encodedPath}`,
        this.props.credentials.url,
      );
      return fetch(url.toString(), {
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
