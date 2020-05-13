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

import { remote } from 'electron';
import React from 'react';
import { Button } from 'reactstrap';

import { IUpdateStatus } from '../../main/Updater';

import realmLogo from '../../../static/svgs/realm-logo.svg';
import { MarketingPanel } from './MarketingPanel';
import { SignupOverlay } from './SignupOverlay';
import { UpdateStatusIndicator } from './UpdateStatusIndicator';

import './Greeting.scss';

const { app } = remote;

export const Greeting = ({
  onCheckForUpdates,
  onOpenLocalRealm,
  updateStatus,
  version,
}: {
  onCheckForUpdates: () => void;
  onOpenLocalRealm: () => void;
  updateStatus: IUpdateStatus;
  version: string;
}) => (
  <div className="Greeting">
    <div className="Greeting__ActionsPanel">
      <div className="Greeting__Brand">
        <svg className="Greeting__Logo" viewBox={realmLogo.viewBox}>
          <use xlinkHref={`#${realmLogo.id}`} />
        </svg>
        <h3 className="Greeting__Title">{app.name}</h3>
        <div>Version {version}</div>
      </div>
      <UpdateStatusIndicator
        status={updateStatus}
        onCheckForUpdates={onCheckForUpdates}
      />
      <div className="Greeting__Actions">
        <div className="Greeting__Action">
          <Button onClick={onOpenLocalRealm}>Open Realm file</Button>
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
