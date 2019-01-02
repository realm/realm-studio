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

import { ImportFormat } from '../services/data-importer';
import { ISyncedRealmToLoad, RealmToLoad } from '../utils/realms';

import { IWindow } from './Window';

export interface IRealmBrowserWindowProps {
  realm: RealmToLoad;
  readOnly?: boolean;
  import?: {
    format: ImportFormat;
    paths: string[];
    schema: Realm.ObjectSchema[];
  };
}

const getRealmUrl = (realm: ISyncedRealmToLoad) => {
  const url = new URL(realm.user.server);
  url.pathname = realm.path;
  return url.toString();
};

// TODO: Consider if we can have the window not show before a connection has been established.

export const RealmBrowserWindow: IWindow = {
  getWindowOptions: (props: IRealmBrowserWindowProps) => {
    return {
      title:
        props.realm.mode === 'synced'
          ? getRealmUrl(props.realm)
          : props.realm.path,
      width: 900,
      height: 600,
    };
  },
  getComponent: () =>
    import(/* webpackChunkName: "realm-browser" */ '../ui/RealmBrowser').then(
      // TODO: Fix the props for this to include a type
      m => m.RealmBrowser as any,
    ),
  getTrackedProperties: (props: IRealmBrowserWindowProps) => ({
    mode: props.realm.mode,
  }),
};
