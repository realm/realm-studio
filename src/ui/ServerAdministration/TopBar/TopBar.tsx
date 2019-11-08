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

import classNames from 'classnames';
import React from 'react';
import { Navbar } from 'reactstrap';

import { ILoadingProgress } from '../../reusable/LoadingOverlay';
import { Tab } from '../ServerAdministration';

import { Logo } from './Logo';
import { Status } from './Status';
import { TabButton } from './TabButton';

import './TopBar.scss';

export interface ITopbarProps {
  activeTab: Tab | null;
  progress: ILoadingProgress;
  className?: string;
  isCloudTenant: boolean;
  onReconnect: () => void;
  onTabChanged: (tab: Tab) => void;
  serverVersion?: string;
  user: Realm.Sync.User | null;
}

export const TopBar = ({
  activeTab,
  progress,
  className,
  isCloudTenant,
  onReconnect,
  onTabChanged,
  serverVersion,
  user,
}: ITopbarProps) => (
  <Navbar className={classNames('TopBar', className)}>
    <Logo />
    {isCloudTenant ? (
      <TabButton
        activeTab={activeTab}
        label="Getting Started"
        onTabChanged={onTabChanged}
        tab={Tab.GettingStarted}
      />
    ) : null}
    <TabButton
      activeTab={activeTab}
      label="Realms"
      onTabChanged={onTabChanged}
      tab={Tab.Realms}
    />
    <TabButton
      activeTab={activeTab}
      label="Users"
      onTabChanged={onTabChanged}
      tab={Tab.Users}
    />
    <TabButton
      activeTab={activeTab}
      label="Logs"
      onTabChanged={onTabChanged}
      tab={Tab.Logs}
    />
    <Status
      onReconnect={onReconnect}
      progress={progress}
      user={user}
      serverVersion={serverVersion}
    />
  </Navbar>
);
