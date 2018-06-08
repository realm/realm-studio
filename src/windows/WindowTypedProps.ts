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

import {
  ICloudAuthenticationWindowProps,
  IConnectToServerWindowProps,
  IGreetingWindowProps,
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
  ITutorialWindowProps,
} from './WindowProps';

export type WindowType =
  | 'cloud-authentication'
  | 'connect-to-server'
  | 'greeting'
  | 'realm-browser'
  | 'server-administration'
  | 'tutorial';

export interface ICloudAuthenticationWindowTypedProps
  extends ICloudAuthenticationWindowProps {
  type: 'cloud-authentication';
}

export interface IConnectToServerWindowTypedProps
  extends IConnectToServerWindowProps {
  type: 'connect-to-server';
}

export interface IGreetingWindowTypedProps extends IGreetingWindowProps {
  type: 'greeting';
}

export interface IRealmBrowserWindowTypedProps
  extends IRealmBrowserWindowProps {
  type: 'realm-browser';
}

export interface IServerAdministrationWindowTypedProps
  extends IServerAdministrationWindowProps {
  type: 'server-administration';
}

export interface ITutorialWindowTypedProps extends ITutorialWindowProps {
  type: 'tutorial';
}

export type WindowTypedProps =
  | ICloudAuthenticationWindowTypedProps
  | IConnectToServerWindowTypedProps
  | IGreetingWindowTypedProps
  | IRealmBrowserWindowTypedProps
  | IServerAdministrationWindowTypedProps
  | ITutorialWindowTypedProps;
