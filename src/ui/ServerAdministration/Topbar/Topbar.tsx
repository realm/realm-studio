import * as React from 'react';
import { Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { ILoadingProgress } from '../../reusable/LoadingOverlay';
import { Tab } from '../ServerAdministration';

import { Status } from './Status';
import { TabButton } from './TabButton';
import { VersionBadge } from './VersionBadge';

export interface ITopbarProps {
  activeTab: Tab | null;
  adminRealmProgress: ILoadingProgress;
  isCloudTenant: boolean;
  onReconnect: () => void;
  onTabChanged: (tab: Tab) => void;
  serverVersion?: string;
  syncError?: Realm.Sync.SyncError;
  user: Realm.Sync.User | null;
}

export const TopBar = ({
  activeTab,
  adminRealmProgress,
  isCloudTenant,
  onReconnect,
  onTabChanged,
  serverVersion,
  syncError,
  user,
}: ITopbarProps) => (
  <Navbar className="ServerAdministration__TopBar">
    <svg
      viewBox={realmLogo.viewBox}
      className="ServerAdministration__TopBar__logo"
    >
      <use xlinkHref={`#${realmLogo.id}`} />
    </svg>
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
      progress={adminRealmProgress}
      user={user}
    />
    <VersionBadge serverVersion={serverVersion} />
  </Navbar>
);
