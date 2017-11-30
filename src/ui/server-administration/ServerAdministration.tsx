import * as classnames from 'classnames';
import * as React from 'react';
import { Button } from 'reactstrap';

import { LoadingOverlay } from '../reusable/loading-overlay';
import { LogContainer } from './logs/LogContainer';
import {
  RealmsTableContainer,
  ValidateCertificatesChangeHandler,
} from './realms/RealmsTableContainer';
import { ToolsContainer } from './tools/ToolsContainer';
import { Topbar } from './Topbar';
import { UsersTableContainer } from './users/UsersTableContainer';

import './ServerAdministration.scss';

export enum Tab {
  Realms = 'realms',
  Users = 'users',
  Logs = 'logs',
  Tools = 'tools',
}

export const ServerAdministration = ({
  activeTab,
  isRealmOpening,
  onRealmOpened,
  onTabChanged,
  user,
  validateCertificates,
  onValidateCertificatesChange,
}: {
  activeTab: Tab;
  isRealmOpening: boolean;
  onRealmOpened: (path: string) => void;
  onTabChanged: (tab: Tab) => void;
  user: Realm.Sync.User | null;
  validateCertificates: boolean;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
}) => {
  let content = null;
  if (user && activeTab === Tab.Realms) {
    content = (
      <RealmsTableContainer
        user={user}
        onRealmOpened={onRealmOpened}
        validateCertificates={validateCertificates}
        onValidateCertificatesChange={onValidateCertificatesChange}
      />
    );
  } else if (user && activeTab === Tab.Users) {
    content = <UsersTableContainer user={user} />;
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
      <Topbar activeTab={activeTab} onTabChanged={onTabChanged} user={user} />
      <div className="ServerAdministration__content">{content}</div>
      <LoadingOverlay loading={!user || isRealmOpening} fade={false} />
    </div>
  );
};
