import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { Tab } from '../ServerAdministration';
import { Topbar } from './Topbar';

export interface ITopbarContainerProps {
  activeTab: Tab;
  onTabChanged: (tab: Tab) => void;
  user: Realm.Sync.User | null;
}

class TopbarContainer extends React.Component<ITopbarContainerProps, {}> {
  public render() {
    return (
      <Topbar
        activeTab={this.props.activeTab}
        onTabChanged={this.props.onTabChanged}
        user={this.props.user}
      />
    );
  }
}

export { TopbarContainer as Topbar };
