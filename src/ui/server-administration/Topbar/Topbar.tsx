import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { Tab } from '../ServerAdministration';
import { TabButton } from './TabButton';

export interface ITopbarProps {
  activeTab: Tab;
  onTabChanged: (tab: Tab) => void;
  user: Realm.Sync.User | null;
}

export const Topbar = ({ activeTab, onTabChanged, user }: ITopbarProps) => (
  <Navbar className="ServerAdministration__tabs">
    <svg viewBox={realmLogo.viewBox} className="ServerAdministration__logo">
      <use xlinkHref={realmLogo.url} />
    </svg>
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
    {/*
    <TabButton
      activeTab={activeTab}
      label="Tools"
      onTabChanged={onTabChanged}
      tab={Tab.Tools}
    />
    */}
    {user && (
      <p className="ServerAdministration__status">
        Connected to&nbsp;
        <span className="ServerAdministration__server">{user.server}</span>
      </p>
    )}
  </Navbar>
);
