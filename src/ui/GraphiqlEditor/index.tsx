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

// import { Fetcher } from 'graphiql';
import * as React from 'react';
// import { Credentials, User } from 'realm-graphql-client';
// import { SubscriptionClient } from 'subscriptions-transport-ws';

import { IGraphiqlEditorWindowProps } from '../../windows/WindowProps';

// import { graphQLFetcher } from './graphiql-subscriptions-fetcher';
import { GraphiqlEditor } from './GraphiqlEditor';

type IGraphiqlEditorContainerProps = IGraphiqlEditorWindowProps;

class GraphiqlEditorContainer extends React.Component<
  IGraphiqlEditorContainerProps,
  {}
> {
  public render() {
    // /* this.state.fetcher */
    return <GraphiqlEditor fetcher={this.httpFetcher} />;
  }

  private getUrl(schema: 'http' | 'ws' = 'http') {
    const encodedPath = encodeURIComponent(this.props.path);
    const url = new URL(`/graphql/${encodedPath}`, this.props.user.server);
    if (url.protocol === 'http:' && schema === 'ws') {
      url.protocol = 'ws:';
    } else if (url.protocol === 'https:' && schema === 'ws') {
      url.protocol = 'wss:';
    }
    return url.toString();
  }

  /*
  private createFetcher(user: User) {
    const url = this.getUrl('ws');
    const subscriptionsClient = new SubscriptionClient(url, {
      reconnect: true,
      connectionParams: { token: user.token },
    });
    return graphQLFetcher(subscriptionsClient, this.httpFetcher);
  }
  */

  private httpFetcher = async (graphQLParams: object) => {
    const url = this.getUrl('http');
    const response = await fetch(url, {
      method: 'post',
      headers: {
        Authorization: this.getToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams),
    });
    return response.json();
  };

  private getToken() {
    const { user } = this.props;
    if ('adminToken' in user) {
      return user.adminToken;
    } else if ('refreshToken' in user) {
      return user.refreshToken;
    } else {
      throw new Error('Failed to determine token');
    }
  }
}

export { GraphiqlEditorContainer as GraphiqlEditor };
