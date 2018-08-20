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

import { RealmFile } from '../../services/ros';
import { ILoadingProgress, LoadingOverlay } from '../reusable/LoadingOverlay';

import { CreateRealmDialog } from './CreateRealmDialog';
import { Dashboard } from './Dashboard';
import { GettingStarted } from './GettingStarted';
import { Log } from './Log';
import { RealmsTable, ValidateCertificatesChangeHandler } from './RealmsTable';
import { ToolsContainer } from './Tools';
import { TopBar } from './TopBar';
import { UsersTable } from './UsersTable';

import './ServerAdministration.scss';

export enum Tab {
  GettingStarted = 'getting-started',
  Dashboard = 'dashboard',
  Realms = 'realms',
  Users = 'users',
  Logs = 'logs',
  Tools = 'tools',
}

interface IServerAdministrationProps {
  activeTab: Tab | null;
  adminRealm?: Realm;
  adminRealmChanges: number;
  adminRealmProgress: ILoadingProgress;
  createRealm: () => Promise<RealmFile>;
  isCloudTenant: boolean;
  isCreateRealmOpen: boolean;
  isCreatingRealm: boolean;
  isRealmOpening: boolean;
  onCancelRealmCreation: () => void;
  onRealmCreation: (path: string) => void;
  onRealmOpened: (path: string, usingGrahpiql?: boolean) => void;
  onReconnect: () => void;
  onTabChanged: (tab: Tab) => void;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
  serverVersion?: string;
  syncError?: Realm.Sync.SyncError;
  user: Realm.Sync.User | null;
  validateCertificates: boolean;
}

const renderContent = ({
  activeTab,
  adminRealm,
  adminRealmChanges,
  createRealm,
  isCloudTenant,
  onRealmOpened,
  onValidateCertificatesChange,
  user,
  validateCertificates,
  serverVersion,
}: IServerAdministrationProps) => {
  if (user && activeTab === Tab.GettingStarted) {
    return <GettingStarted serverUrl={user.server} />;
  } else if (user && activeTab === Tab.Dashboard) {
    return <Dashboard isCloudTenant={isCloudTenant} serverUrl={user.server} />;
  } else if (user && adminRealm && activeTab === Tab.Realms) {
    return (
      <RealmsTable
        adminRealm={adminRealm}
        adminRealmChanges={adminRealmChanges}
        createRealm={createRealm}
        onRealmOpened={onRealmOpened}
        onValidateCertificatesChange={onValidateCertificatesChange}
        user={user}
        validateCertificates={validateCertificates}
        serverVersion={serverVersion}
      />
    );
  } else if (user && adminRealm && activeTab === Tab.Users) {
    return (
      <UsersTable
        adminRealm={adminRealm}
        adminRealmChanges={adminRealmChanges}
        user={user}
        validateCertificates={validateCertificates}
      />
    );
  } else if (user && activeTab === Tab.Logs) {
    return <Log serverUrl={user.server} token={user.token} />;
  } else if (user && activeTab === Tab.Tools) {
    return <ToolsContainer user={user} />;
  } else {
    return null;
  }
};

export const ServerAdministration = (props: IServerAdministrationProps) => {
  const {
    activeTab,
    adminRealmProgress,
    isCloudTenant,
    isCreateRealmOpen,
    isCreatingRealm,
    isRealmOpening,
    onCancelRealmCreation,
    onRealmCreation,
    onReconnect,
    onTabChanged,
    serverVersion,
    user,
  } = props;

  return (
    <div className="ServerAdministration">
      <TopBar
        activeTab={activeTab}
        adminRealmProgress={adminRealmProgress}
        className="ServerAdministration__TopBar"
        isCloudTenant={isCloudTenant}
        onReconnect={onReconnect}
        onTabChanged={onTabChanged}
        serverVersion={serverVersion}
        user={user}
      />
      <div className="ServerAdministration__content">
        {adminRealmProgress.status === 'done' ? renderContent(props) : null}
      </div>

      <CreateRealmDialog
        isBusy={isCreatingRealm}
        isOpen={isCreateRealmOpen}
        onCancelRealmCreation={onCancelRealmCreation}
        onRealmCreation={onRealmCreation}
      />

      <LoadingOverlay
        loading={!user || isRealmOpening}
        progress={adminRealmProgress}
        fade={true}
      />
    </div>
  );
};
