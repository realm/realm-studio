import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { Tab } from '../ServerAdministration';
import { TabButton } from './TabButton';

export interface ITopbarProps {
  activeTab: Tab | null;
  isCloudTenant: boolean;
  onTabChanged: (tab: Tab) => void;
  user: Realm.Sync.User | null;
}

export const TopBar = ({
  activeTab,
  isCloudTenant,
  onTabChanged,
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
    {user && (
      <p className="ServerAdministration__status">
        <span className="ServerAdministration__server">{user.server}</span>
      </p>
    )}
  </Navbar>
);
