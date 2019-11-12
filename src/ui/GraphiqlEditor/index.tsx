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

import React from 'react';
import { IGraphiqlEditorWindowProps } from '../../windows/WindowProps';

import { createGraphQLFetcher } from './graphiql-subscriptions-fetcher';
import { GraphiqlEditor } from './GraphiqlEditor';

type IGraphiqlEditorContainerProps = IGraphiqlEditorWindowProps;

class GraphiqlEditorContainer extends React.Component<
  IGraphiqlEditorContainerProps,
  {}
> {
  public render() {
    return (
      <GraphiqlEditor
        fetcher={createGraphQLFetcher({
          getToken: () => this.getToken(),
          url: new URL(
            `/graphql/${encodeURIComponent(this.props.path)}`,
            this.props.user.server,
          ).toString(),
        })}
      />
    );
  }

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
