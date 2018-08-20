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

/**
 * A WindowProps object is passed to the UI component when mounted and describes the internal properties for that.
 */

import { ICloudAuthenticationWindowProps } from './CloudAuthenticationWindow';
import { IConnectToServerWindowProps } from './ConnectToServerWindow';
import { IGraphiqlEditorWindowProps } from './GraphiqlEditorWindow';
import { IGreetingWindowProps } from './GreetingWindow';
import { IRealmBrowserWindowProps } from './RealmBrowserWindow';
import { IServerAdministrationWindowProps } from './ServerAdministrationWindow';

export {
  ICloudAuthenticationWindowProps,
  IConnectToServerWindowProps,
  IGraphiqlEditorWindowProps,
  IGreetingWindowProps,
  IRealmBrowserWindowProps,
  IServerAdministrationWindowProps,
};

export type WindowProps =
  | ICloudAuthenticationWindowProps
  | IConnectToServerWindowProps
  | IGraphiqlEditorWindowProps
  | IGreetingWindowProps
  | IRealmBrowserWindowProps
  | IServerAdministrationWindowProps;
