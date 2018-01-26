import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { ILoadingProgress } from '../../reusable/loading-overlay';
import { Tab } from '../ServerAdministration';
import { TopBar } from './Topbar';

export interface ITopBarContainerProps {
  adminRealmProgress: ILoadingProgress;
  activeTab: Tab | null;
  isCloudTenant: boolean;
  onTabChanged: (tab: Tab) => void;
  user: Realm.Sync.User | null;
  onReconnect: () => void;
}

class TopBarContainer extends React.Component<ITopBarContainerProps, {}> {
  public render() {
    return (
      <TopBar
        activeTab={this.props.activeTab}
        adminRealmProgress={this.props.adminRealmProgress}
        isCloudTenant={this.props.isCloudTenant}
        onReconnect={this.props.onReconnect}
        onTabChanged={this.props.onTabChanged}
        user={this.props.user}
      />
    );
  }
}

export { TopBarContainer as TopBar };
