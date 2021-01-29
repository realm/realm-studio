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

import { main } from '../../actions/main';
import { IUpdateStatus } from '../../main/Updater';
import { IMenuGeneratorProps } from '../../windows/MenuGenerator';

import { Greeting } from './Greeting';

export type SocialNetwork = 'twitter' | 'facebook' | 'reddit' | 'hacker-news';

interface IGreetingContainerState {
  isCloudInstancesDropdownOpen: boolean;
  isSyncEnabled: boolean;
  updateStatus: IUpdateStatus;
  version: string;
}

class GreetingContainer extends React.Component<
  IMenuGeneratorProps,
  IGreetingContainerState
> {
  public state: IGreetingContainerState = {
    isCloudInstancesDropdownOpen: false,
    isSyncEnabled: false,
    updateStatus: {
      state: 'up-to-date',
    },
    version: electron.remote.app.getVersion() || 'unknown',
  };

  public componentDidMount() {
    electron.ipcRenderer.on('update-status', this.updateStatusChanged);
    // Require realm and check update state with the sync support
    // Using nextTick to prevent blocking when loading realm
    process.nextTick(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Realm = require('realm');
      this.setState({
        isSyncEnabled: !!Realm.Sync,
      });
    });
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'update-status',
      this.updateStatusChanged,
    );
  }

  public render() {
    return <Greeting {...this.state} {...this} />;
  }

  public onOpenLocalRealm = () => {
    main.showOpenLocalRealm();
  };

  public onCheckForUpdates = () => {
    main.checkForUpdates();
  };

  public updateStatusChanged = (
    e: Electron.IpcRendererEvent,
    status: IUpdateStatus,
  ) => {
    this.setState({ updateStatus: status });
  };
}

export { GreetingContainer as Greeting };
