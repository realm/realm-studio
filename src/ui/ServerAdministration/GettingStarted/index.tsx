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

import electron from 'electron';
import React from 'react';

import { GettingStarted } from './GettingStarted';

export type Platform = 'ios' | 'android' | 'react-native' | 'xamarin';

interface IGettingStartedContainerProps {
  serverUrl: string;
}

class GettingStartedContainer extends React.Component<
  IGettingStartedContainerProps,
  {}
> {
  public render() {
    return (
      <GettingStarted
        serverUrl={this.normalizeUrl(this.props.serverUrl)}
        {...this.state}
        {...this}
      />
    );
  }

  public normalizeUrl = (url: string): string => {
    // Strip protocol
    url = url.replace(/(^\w+:|^)\/\//, '');
    // Strip / suffix
    url = url.replace(/\/$/, '');
    return url;
  };

  public onShowTutorial = (name: Platform) => {
    if (name === 'ios') {
      electron.shell.openExternal(
        'https://docs.realm.io/sync/getting-started-1/step-1-my-first-realm-app',
      );
    } else if (name === 'android') {
      electron.shell.openExternal(
        'https://docs.realm.io/sync/getting-started-1/step-1-my-first-realm-app-1',
      );
    } else if (name === 'xamarin') {
      electron.shell.openExternal(
        'https://docs.realm.io/sync/getting-started-1/step-1-my-first-realm-app-2',
      );
    } else if (name === 'react-native') {
      electron.shell.openExternal(
        'https://docs.realm.io/sync/getting-started-1/step-1-my-first-realm-app-2',
      );
    }
  };
}

export { GettingStartedContainer as GettingStarted };
