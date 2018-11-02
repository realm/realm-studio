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

import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../../actions/main';

import { GettingStarted } from './GettingStarted';

export type Platform = 'android' | 'apple' | 'javascript' | 'xamarin';

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

  public onShowTutorial = (name: 'ios' | 'android' | 'react-native') => {
    if (name === 'ios') {
      electron.shell.openExternal(
        'https://docs.realm.io/platform/v/3.x/getting-started-1/ios-quick-start',
      );
    } else if (name === 'android') {
      electron.shell.openExternal(
        'https://docs.realm.io/platform/v/3.x/getting-started-1/android-quick-start',
      );
    } else if (name === 'react-native') {
      electron.shell.openExternal(
        'https://docs.realm.io/platform/v/3.x/getting-started-1/react-native-quick-start',
      );
    }
  };
}

export { GettingStartedContainer as GettingStarted };
