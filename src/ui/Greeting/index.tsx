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
import * as qs from 'querystring';
import * as React from 'react';

import { main } from '../../actions/main';
import { ICloudStatus, IInstance } from '../../main/CloudManager';
import { IUpdateStatus } from '../../main/Updater';
import * as raas from '../../services/raas';
import { IMenuGeneratorProps } from '../../windows/MenuGenerator';
import { showError } from '../reusable/errors';

import { Greeting } from './Greeting';

export type SocialNetwork = 'twitter' | 'facebook' | 'reddit' | 'hacker-news';

interface IGreetingContainerState {
  cloudStatus?: ICloudStatus;
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
    electron.ipcRenderer.on('cloud-status', this.cloudStatusChanged);
    electron.ipcRenderer.on('update-status', this.updateStatusChanged);

    // Require realm and check update state with the sync support
    // Using nextTick to prevent blocking when loading realm
    process.nextTick(() => {
      const Realm = require('realm');
      this.setState({
        isSyncEnabled: !!Realm.Sync,
      });
    });
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'cloud-status',
      this.cloudStatusChanged,
    );
    electron.ipcRenderer.removeListener(
      'update-status',
      this.updateStatusChanged,
    );
  }

  public render() {
    return <Greeting {...this.state} {...this} />;
  }

  public onAuthenticate = async () => {
    await main.showCloudAuthentication();
  };

  public onCloudInstanceCreated = async (instance: IInstance) => {
    await main.refreshCloudStatus();
    this.onConnectToCloudInstance(instance);
  };

  public onConnectToCloudInstance = async (
    instance: IInstance,
  ): Promise<void> => {
    try {
      const tenantUrl = instance.tenantUrl;
      if (tenantUrl) {
        const credentials = raas.user.getTenantCredentials(tenantUrl);
        return main.showServerAdministration({
          credentials,
          validateCertificates: true,
          isCloudTenant: true,
        });
      } else {
        throw new Error(`Couldn't determine the URL of the server`);
      }
    } catch (err) {
      showError('Failed to connect to the server', err);
    }
  };

  public onConnectToServer = () => {
    main.showConnectToServer();
  };

  public onOpenLocalRealm = () => {
    main.showOpenLocalRealm();
  };

  public onCheckForUpdates = () => {
    main.checkForUpdates();
  };

  public onDeauthenticate = () => {
    main.deauthenticate();
  };

  public updateStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: IUpdateStatus,
  ) => {
    this.setState({ updateStatus: status });
  };

  public cloudStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: ICloudStatus,
  ) => {
    // Focus the window when the status requires the users attention
    if (status.kind === 'authenticated') {
      electron.remote.getCurrentWindow().focus();
    }
    // Update the cloud status
    this.setState({ cloudStatus: status });
    this.props.updateMenu();
  };

  public onRefreshCloudStatus = () => {
    main.refreshCloudStatus();
  };

  public onInstanceCreate = () => {
    const endpoint = raas.getEndpoint();
    electron.remote.shell.openExternal(`${endpoint}/instances/create`);
  };

  public onShare = (socialNetwork: SocialNetwork) => {
    const url = this.getShareUrl(socialNetwork);
    if (url) {
      electron.shell.openExternal(url);
    } else {
      alert('We have not announced this yet');
    }
  };

  public onToggleCloudInstancesDropdown = () => {
    const { isCloudInstancesDropdownOpen } = this.state;
    this.setState({
      isCloudInstancesDropdownOpen: !isCloudInstancesDropdownOpen,
    });
  };

  protected getShareUrl(socialNetwork: SocialNetwork) {
    if (socialNetwork === 'twitter') {
      // See https://dev.twitter.com/web/tweet-button for options
      const query = qs.stringify({
        text: 'Excited that Realm is creating a #cloud solution!',
        via: 'realm',
      });
      return `https://twitter.com/intent/tweet?${query}`;
    } else if (socialNetwork === 'facebook') {
      const query = qs.stringify({
        // TODO: Update this URL once we have announced it
        u: encodeURI('https://realm.io/products/realm-cloud'),
        display: 'page',
      });
      return `https://www.facebook.com/sharer/sharer.php?${query}`;
    } else if (socialNetwork === 'reddit') {
      // TODO: Make this a link to a post we've created
    } else if (socialNetwork === 'hacker-news') {
      // TODO: Make this a link to a post we've created
      // https://news.ycombinator.com/item?id=15853477
    }
  }
}

export { GreetingContainer as Greeting };
