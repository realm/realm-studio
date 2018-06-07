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

import { Window } from './Window';
import { IGreetingWindowTypedProps } from './WindowTypedProps';

// tslint:disable-next-line:no-empty-interface
export interface IGreetingWindowProps {
  // Tumbleweed
}

export class GreetingWindow extends Window {
  public static getWindowOptions(): Partial<
    Electron.BrowserWindowConstructorOptions
  > {
    return {
      title: `Realm Studio`,
      width: 600,
      height: 400,
      resizable: false,
    };
  }

  public static getComponent() {
    return require('../ui').Greeting;
  }
}
