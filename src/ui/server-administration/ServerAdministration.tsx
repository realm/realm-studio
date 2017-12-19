import * as classnames from 'classnames';
import * as React from 'react';
import { Button } from 'reactstrap';

import { LoadingOverlay } from '../reusable/loading-overlay';
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

export const ServerAdministration = ({
  activeTab,
  isCloudTenant,
  isRealmOpening,
  onRealmOpened,
  onTabChanged,
  user,
  validateCertificates,
  onValidateCertificatesChange,
}: {
  activeTab: Tab | null;
  isCloudTenant: boolean;
  isRealmOpening: boolean;
  onRealmOpened: (path: string) => void;
  onTabChanged: (tab: Tab) => void;
  user: Realm.Sync.User | null;
  validateCertificates: boolean;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
}) => {
  let content = null;
  if (user && activeTab === Tab.Dashboard) {
    content = <Dashboard isCloudTenant={isCloudTenant} />;
  } else if (user && activeTab === Tab.Realms) {
    content = (
      <RealmsTableContainer
        user={user}
        onRealmOpened={onRealmOpened}
        validateCertificates={validateCertificates}
        onValidateCertificatesChange={onValidateCertificatesChange}
      />
    );
  } else if (user && activeTab === Tab.Users) {
    content = (
      <UsersTableContainer
        user={user}
        validateCertificates={validateCertificates}
      />
    );
  } else if (user && activeTab === Tab.Logs) {
    content = <LogContainer user={user} />;
  } else if (user && activeTab === Tab.Tools) {
    content = <ToolsContainer user={user} />;
  } else {
    content = (
      <p className="ServerAdministration__no-content">
        This tab has no content yet
      </p>
    );
  }

  return (
    <div className="ServerAdministration">
      <TopBar
        activeTab={activeTab}
        isCloudTenant={isCloudTenant}
        onTabChanged={onTabChanged}
        user={user}
      />
      <div className="ServerAdministration__content">{content}</div>
      <LoadingOverlay loading={!user || isRealmOpening} fade={false} />
    </div>
  );
};
