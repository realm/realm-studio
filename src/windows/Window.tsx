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

import { IMenuGeneratorProps } from './MenuGenerator';
import { WindowProps } from './WindowProps';
import { WindowType, WindowTypedProps } from './WindowTypedProps';

export interface IWindow {
  getComponent(): React.ComponentClass<WindowTypedProps & IMenuGeneratorProps>;
  getWindowOptions(
    props: WindowProps,
  ): Partial<Electron.BrowserWindowConstructorOptions>;
  getTrackedProperties(props: WindowProps): { [key: string]: string };
}

import { CloudAuthenticationWindow } from './CloudAuthenticationWindow';
import { ConnectToServerWindow } from './ConnectToServerWindow';
import { GreetingWindow } from './GreetingWindow';
import { RealmBrowserWindow } from './RealmBrowserWindow';
import { ServerAdministrationWindow } from './ServerAdministrationWindow';

export function getWindowClass(props: WindowTypedProps): IWindow {
  // We're using calls to require here, to prevent loading anything that does not
  // relate to the specific window being loaded.
  if (props.type === 'cloud-authentication') {
    return CloudAuthenticationWindow;
  } else if (props.type === 'connect-to-server') {
    return ConnectToServerWindow;
  } else if (props.type === 'greeting') {
    return GreetingWindow;
  } else if (props.type === 'realm-browser') {
    return RealmBrowserWindow;
  } else if (props.type === 'server-administration') {
    return ServerAdministrationWindow;
  } else {
    throw new Error(`Unexpected window type: ${(props as any).type}`);
  }
}

/*
 * Generate options that should get passed to the BrowserWindow constructor,
 * when opening a particular window type.
 */
export function getWindowOptions(
  props: WindowTypedProps,
): Partial<Electron.BrowserWindowConstructorOptions> {
  const WindowClass = getWindowClass(props);
  return WindowClass.getWindowOptions(props);
}
