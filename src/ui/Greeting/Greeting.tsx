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

import os from 'os';
import React from 'react';
import { Button } from 'reactstrap';

import { ICloudStatus, IInstance } from '../../main/CloudManager';
import { IUpdateStatus } from '../../main/Updater';

import realmLogo from '../../../static/svgs/realm-logo.svg';
import { SocialNetwork } from './';
import { CloudAction } from './CloudAction';
import { MarketingPanel } from './MarketingPanel';
import { SignupOverlay } from './SignupOverlay';
import { UpdateStatusIndicator } from './UpdateStatusIndicator';

import './Greeting.scss';

export const Greeting = ({
  cloudStatus,
  isCloudInstancesDropdownOpen,
  isSyncEnabled,
  onAuthenticate,
  onCheckForUpdates,
  onConnectToCloudInstance,
  onConnectToServer,
  onDeauthenticate,
  onInstanceCreate,
  onOpenLocalRealm,
  onRefreshCloudStatus,
  onShare,
  onToggleCloudInstancesDropdown,
  updateStatus,
  version,
}: {
  cloudStatus?: ICloudStatus;
  isCloudInstancesDropdownOpen: boolean;
  isSyncEnabled: boolean;
  onAuthenticate: () => void;
  onCheckForUpdates: () => void;
  onConnectToCloudInstance: (instance: IInstance) => void;
  onConnectToServer: () => void;
  onDeauthenticate: () => void;
  onInstanceCreate: () => void;
  onOpenLocalRealm: () => void;
  onRefreshCloudStatus: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
  onToggleCloudInstancesDropdown: () => void;
  updateStatus: IUpdateStatus;
  version: string;
}) => (
  <div className="Greeting">
    <div className="Greeting__ActionsPanel">
      <div className="Greeting__Brand">
        <svg className="Greeting__Logo" viewBox={realmLogo.viewBox}>
          <use xlinkHref={`#${realmLogo.id}`} />
        </svg>
        <h3 className="Greeting__Title">Realm Studio</h3>
        <div>Version {version}</div>
      </div>
      <UpdateStatusIndicator
        status={updateStatus}
        onCheckForUpdates={onCheckForUpdates}
      />
      <div className="Greeting__Actions">
        <div className="Greeting__Action">
          <CloudAction
            cloudStatus={cloudStatus}
            isCloudInstancesDropdownOpen={isCloudInstancesDropdownOpen}
            onAuthenticate={onAuthenticate}
            onConnectToCloudInstance={onConnectToCloudInstance}
            onDeauthenticate={onDeauthenticate}
            onInstanceCreate={onInstanceCreate}
            onRefresh={onRefreshCloudStatus}
            onShare={onShare}
            onToggleCloudInstancesDropdown={onToggleCloudInstancesDropdown}
          />
        </div>
        <div className="Greeting__SecondaryActions">
          <Button color="secondary" size="sm" onClick={onOpenLocalRealm}>
            Open Realm file
          </Button>
          <Button
            onClick={onConnectToServer}
            disabled={!isSyncEnabled}
            color="secondary"
            size="sm"
            title={
              isSyncEnabled
                ? 'Click to connect to a Realm Object Server'
                : `This feature is currently not available on ${os.type()}`
            }
          >
            Connect to Server
          </Button>
        </div>
      </div>
      <div className="Greeting__DownloadDemo">
        <span>New to realm? </span>
        <a
          href="https://static.realm.io/downloads/realm-studio/demo.realm"
          className="Link"
        >
          Download a demo Realm file
        </a>
      </div>
    </div>
    <MarketingPanel className="Greeting__MarketingPanel" />
    <SignupOverlay />
  </div>
);
