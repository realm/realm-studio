import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { Tab } from '../ServerAdministration';
import { TopBar } from './TopBar';

export interface ITopBarContainerProps {
  activeTab: Tab | null;
  isCloudTenant: boolean;
  onTabChanged: (tab: Tab) => void;
  user: Realm.Sync.User | null;
}

class TopBarContainer extends React.Component<ITopBarContainerProps, {}> {
  public render() {
    return (
      <TopBar
        activeTab={this.props.activeTab}
        isCloudTenant={this.props.isCloudTenant}
        onTabChanged={this.props.onTabChanged}
        user={this.props.user}
      />
    );
  }
}

export { TopBarContainer as TopBar };
