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

import qs from 'querystring';

import {
  IGreetingWindowProps,
  IRealmBrowserWindowProps,
  IConnectToServerWindowProps,
  WindowProps,
} from './WindowProps';

export type WindowType =
  | 'cloud-authentication'
  | 'connect-to-server'
  | 'graphiql-editor'
  | 'greeting'
  | 'realm-browser'
  | 'server-administration';

/**
 * A WindowOptions object contains the type of window and the props getting passed to its UI component
 */
interface IWindowOptions {
  type: WindowType;
  props: WindowProps;
}

export interface IGreetingWindowOptions extends IWindowOptions {
  type: 'greeting';
  props: IGreetingWindowProps;
}

export interface IRealmBrowserWindowOptions extends IWindowOptions {
  type: 'realm-browser';
  props: IRealmBrowserWindowProps;
}

export interface IConnectToServerWindowOptions extends IWindowOptions {
  type: 'connect-to-server';
  props: IConnectToServerWindowProps;
}

export type WindowOptions =
  | IGreetingWindowOptions
  | IRealmBrowserWindowOptions
  | IConnectToServerWindowOptions;

export function getWindowOptions(): WindowOptions {
  // Strip away the "?" of the location.search
  const queryString = location.search.substr(1);
  const query = qs.parse(queryString);
  if (query && typeof query.options === 'string') {
    return JSON.parse(query.options);
  } else {
    throw new Error('Expected "options" in the query parameters');
  }
}
