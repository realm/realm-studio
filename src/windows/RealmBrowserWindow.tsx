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
import { URL } from 'url';

import * as ros from '../services/ros';
import { RealmBrowser } from '../ui';

import { IWindow } from './Window';
import { IRealmBrowserWindowTypedProps } from './WindowTypedProps';

export interface IRealmBrowserWindowProps {
  realm: ros.realms.ISyncedRealmToLoad | ros.realms.ILocalRealmToLoad;
}

const getRealmUrl = (realm: ros.realms.ISyncedRealmToLoad) => {
  const url = new URL(
    realm.authentication instanceof Realm.Sync.User
      ? realm.authentication.server
      : realm.authentication.url,
  );
  url.pathname = realm.path;
  return url.toString();
};

// TODO: Consider if we can have the window not show before a connection has been established.

export const RealmBrowserWindow: IWindow = {
  getWindowOptions: (
    props: IRealmBrowserWindowProps,
  ): Partial<Electron.BrowserWindowConstructorOptions> => {
    return {
      title:
        props.realm.mode === 'synced'
          ? getRealmUrl(props.realm)
          : props.realm.path,
    };
  },
  getComponent: () => require('../ui').RealmBrowser,
  getTrackedProperties: (props: IRealmBrowserWindowProps) => ({
    mode: props.realm.mode,
  }),
};
