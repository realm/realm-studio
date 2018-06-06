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

import * as React from 'react';

import { RealmBrowser } from '../ui/RealmBrowser';
import { Window } from './Window';
import { IRealmBrowserWindowProps } from './WindowType';

// TODO: Consider if we can have the window not show before a connection has been established.

export class RealmBrowserWindow extends Window<IRealmBrowserWindowProps, {}> {
  public render() {
    return (
      <RealmBrowser
        {...this.props}
        addMenuGenerator={this.addMenuGenerator}
        removeMenuGenerator={this.removeMenuGenerator}
        updateMenu={this.updateMenu}
      />
    );
  }

  protected getTrackedProperties() {
    return {
      ...super.getTrackedProperties(),
      mode: this.props.realm.mode,
    };
  }
}
