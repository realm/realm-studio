import * as classnames from 'classnames';
import * as React from 'react';
import { Button } from 'reactstrap';

import * as ros from '../../services/ros';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { Dashboard } from './Dashboard';
import { LogContainer } from './logs/LogContainer';
import {
  RealmsTableContainer,
  ValidateCertificatesChangeHandler,
} from './realms/RealmsTableContainer';
import { ToolsContainer } from './tools/ToolsContainer';
import { TopBar } from './Topbar';
import { UsersTableContainer } from './users/UsersTableContainer';

import './ServerAdministration.scss';

export enum Tab {
  Dashboard = 'dashboard',
  Realms = 'realms',
  Users = 'users',
  Logs = 'logs',
  Tools = 'tools',
}

interface IServerAdministrationProps {
  activeTab: Tab | null;
  adminRealm: Realm;
  adminRealmProgress: ILoadingProgress;
  isCloudTenant: boolean;
  isRealmOpening: boolean;
  onRealmOpened: (path: string) => void;
  onReconnect: () => void;
  onTabChanged: (tab: Tab) => void;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
  syncError?: Realm.Sync.SyncError;
  user: Realm.Sync.User | null;
  validateCertificates: boolean;
}

const getContent = ({
  activeTab,
  adminRealm,
  isCloudTenant,
  onRealmOpened,
  onValidateCertificatesChange,
  user,
  validateCertificates,
}: IServerAdministrationProps) => {
  if (user && activeTab === Tab.Dashboard) {
    return <Dashboard isCloudTenant={isCloudTenant} />;
  } else if (user && adminRealm && activeTab === Tab.Realms) {
    return (
      <RealmsTableContainer
        adminRealm={adminRealm}
        onRealmOpened={onRealmOpened}
        onValidateCertificatesChange={onValidateCertificatesChange}
        user={user}
        validateCertificates={validateCertificates}
      />
    );
  } else if (user && adminRealm && activeTab === Tab.Users) {
    return (
      <UsersTableContainer
        adminRealm={adminRealm}
        user={user}
        validateCertificates={validateCertificates}
      />
    );
  } else if (user && activeTab === Tab.Logs) {
    return <LogContainer user={user} />;
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
    syncError,
    user,
  } = props;

  return (
    <div className="ServerAdministration">
      <TopBar
        activeTab={activeTab}
        adminRealmProgress={adminRealmProgress}
        isCloudTenant={isCloudTenant}
        onReconnect={onReconnect}
        onTabChanged={onTabChanged}
        syncError={syncError}
        user={user}
      />
      <div className="ServerAdministration__content">{getContent(props)}</div>
      <LoadingOverlay
        loading={!user || isRealmOpening}
        progress={adminRealmProgress}
        fade={true}
      />
    </div>
  );
};
