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

import { IWindow } from './Window';
import { app } from 'electron';

// tslint:disable-next-line:no-empty-interface
export interface IGreetingWindowProps {
  // Tumbleweed
}

export const GreetingWindow: IWindow = {
  getWindowOptions: () => ({
    title: app.name,
    width: 700,
    height: 400,
    resizable: false,
    fullscreenable: false,
  }),
  getComponent: () =>
    import(/* webpackChunkName: "greeting" */ '../ui/Greeting').then(
      // TODO: Fix the props for this to include a type
      m => m.Greeting as any,
    ),
  getTrackedProperties: () => ({}),
};
