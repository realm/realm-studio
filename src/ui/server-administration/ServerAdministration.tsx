import * as classnames from 'classnames';
import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../static/svgs/realm-logo.svg';

import * as ros from '../../services/ros';
import { ILoadingProgress, LoadingOverlay } from '../reusable/loading-overlay';
import { LogContainer } from './logs/LogContainer';
import {
  RealmsTableContainer,
  ValidateCertificatesChangeHandler,
} from './realms/RealmsTableContainer';
import { Status } from './Status';
import { ToolsContainer } from './tools/ToolsContainer';
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
  adminRealm,
  adminRealmProgress,
  isRealmOpening,
  onRealmOpened,
  onReconnect,
  onTabChanged,
  onValidateCertificatesChange,
  user,
  validateCertificates,
}: {
  activeTab: Tab;
  adminRealm: Realm;
  adminRealmProgress: ILoadingProgress;
  isRealmOpening: boolean;
  onRealmOpened: (path: string) => void;
  onReconnect: () => void;
  onTabChanged: (tab: Tab) => void;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
  user: Realm.Sync.User | null;
  validateCertificates: boolean;
}) => {
  let content = null;
  if (user && adminRealm && activeTab === Tab.Realms) {
    content = (
      <RealmsTableContainer
        adminRealm={adminRealm}
        onRealmOpened={onRealmOpened}
        onValidateCertificatesChange={onValidateCertificatesChange}
        user={user}
        validateCertificates={validateCertificates}
      />
    );
  } else if (user && adminRealm && activeTab === Tab.Users) {
    content = (
      <UsersTableContainer
        adminRealm={adminRealm}
        user={user}
        validateCertificates={validateCertificates}
      />
    );
  } else if (user && activeTab === Tab.Logs) {
    content = <LogContainer user={user} />;
  } else if (user && activeTab === Tab.Tools) {
    content = <ToolsContainer user={user} />;
  } else {
    content = null;
  }

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => {
    return (
      <Button
        color={activeTab === tab ? 'primary' : 'secondary'}
        className="ServerAdministration__tab"
        onClick={() => {
          onTabChanged(tab);
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className="ServerAdministration">
      <Navbar className="ServerAdministration__tabs">
        <svg viewBox={realmLogo.viewBox} className="ServerAdministration__logo">
          <use xlinkHref={realmLogo.url} />
        </svg>
        <TabButton tab={Tab.Realms} label="Realms" />
        <TabButton tab={Tab.Users} label="Users" />
        <TabButton tab={Tab.Logs} label="Logs" />
        {/* <TabButton tab={Tab.Tools} label="Tools" /> */}
        <Status
          onReconnect={onReconnect}
          progress={adminRealmProgress}
          user={user}
        />
      </Navbar>
      <div className="ServerAdministration__content">{content}</div>
      <LoadingOverlay
        loading={!user || isRealmOpening}
        progress={adminRealmProgress}
        fade={true}
      />
    </div>
  );
};
