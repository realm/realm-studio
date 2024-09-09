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
import { WindowOptions, WindowType } from './WindowOptions';
import { WindowProps } from './WindowProps';

export type InnerWindowComponent = React.ComponentClass<
  WindowProps & IMenuGeneratorProps
>;

export interface IWindow {
  getComponent(): Promise<InnerWindowComponent>;
  getWindowOptions(
    props: WindowProps,
  ): Partial<Electron.BrowserWindowConstructorOptions>;
  getSingletonKey?(props: WindowProps): string | undefined;
  getTrackedProperties(props: WindowProps): { [key: string]: string };
}

import { GreetingWindow } from './GreetingWindow';
import { RealmBrowserWindow } from './RealmBrowserWindow';

export interface IWindowConstructorOptions
  extends Partial<Electron.BrowserWindowConstructorOptions> {
  maximize?: boolean;
}

export function getWindowClass(type: WindowType): IWindow {
  // We're using calls to require here, to prevent loading anything that does not
  // relate to the specific window being loaded.
  if (type === 'greeting') {
    return GreetingWindow;
  } else if (type === 'realm-browser') {
    return RealmBrowserWindow;
  } else {
    throw new Error(`Unexpected window type: ${type}`);
  }
}

/*
 * Generate options that should get passed to the BrowserWindow constructor,
 * when opening a particular window type.
 */
export function getWindowOptions({
  type,
  props,
}: WindowOptions): IWindowConstructorOptions {
  const WindowClass = getWindowClass(type);
  return WindowClass.getWindowOptions(props);
}

export function getSingletonKey({
  type,
  props,
}: WindowOptions): string | undefined {
  const WindowClass = getWindowClass(type);
  return WindowClass.getSingletonKey
    ? WindowClass.getSingletonKey(props)
    : undefined;
}
