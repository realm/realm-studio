import * as React from 'react';

import { ILoadingProgress, LoadingOverlay } from '../reusable/LoadingOverlay';
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
  isCloudTenant: boolean;
  isRealmOpening: boolean;
  onRealmOpened: (path: string) => void;
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
  isCloudTenant,
  onRealmOpened,
  onValidateCertificatesChange,
  user,
  validateCertificates,
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
        onRealmOpened={onRealmOpened}
        onValidateCertificatesChange={onValidateCertificatesChange}
        user={user}
        validateCertificates={validateCertificates}
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
    isRealmOpening,
    onReconnect,
    onTabChanged,
    serverVersion,
    syncError,
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
      <LoadingOverlay
        loading={!user || isRealmOpening}
        progress={adminRealmProgress}
        fade={true}
      />
    </div>
  );
};
