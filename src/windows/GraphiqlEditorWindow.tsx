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

import { URL } from 'url';

import { ros } from '../services';

import { IWindow } from './Window';

export interface IGraphiqlEditorWindowProps {
  credentials: ros.IServerCredentials;
  path: string;
}

const getUrl = (credentials: ros.IServerCredentials, path: string) => {
  return new URL(path, credentials.url).toString();
};

export const GraphiqlEditorWindow: IWindow = {
  getWindowOptions: (props: IGraphiqlEditorWindowProps) => {
    return {
      title: getUrl(props.credentials, props.path),
    };
  },
  getComponent: () =>
    import(/* webpackChunkName: "graphiql-editor" */ '../ui/GraphiqlEditor').then(
      // TODO: Fix the props for this to include a type
      m => m.GraphiqlEditor as any,
    ),
  getTrackedProperties: (props: IGraphiqlEditorWindowProps) => ({}),
};
