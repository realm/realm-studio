import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { ILoadingProgress } from '../../reusable/loading-overlay';
import { Tab } from '../ServerAdministration';
import { Status } from './Status';
import { TabButton } from './TabButton';

export interface ITopbarProps {
  activeTab: Tab | null;
  adminRealmProgress: ILoadingProgress;
  isCloudTenant: boolean;
  onReconnect: () => void;
  onTabChanged: (tab: Tab) => void;
  syncError?: Realm.Sync.SyncError;
  user: Realm.Sync.User | null;
}

export const TopBar = ({
  activeTab,
  adminRealmProgress,
  isCloudTenant,
  onReconnect,
  onTabChanged,
  syncError,
  user,
}: ITopbarProps) => (
  <Navbar className="ServerAdministration__TobBar">
    <svg
      viewBox={realmLogo.viewBox}
      className="ServerAdministration__TobBar__logo"
    >
      <use xlinkHref={realmLogo.url} />
    </svg>
    {isCloudTenant ? (
      <TabButton
        activeTab={activeTab}
        label="Dashboard"
        onTabChanged={onTabChanged}
        tab={Tab.Dashboard}
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
      progress={adminRealmProgress}
      user={user}
    />
  </Navbar>
);
