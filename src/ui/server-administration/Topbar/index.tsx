import * as React from 'react';
import { Button, Navbar } from 'reactstrap';

import realmLogo from '../../../../static/svgs/realm-logo.svg';
import { ILoadingProgress } from '../../reusable/loading-overlay';
import { Tab } from '../ServerAdministration';
import { TopBar } from './Topbar';

export interface ITopBarContainerProps {
  activeTab: Tab | null;
  adminRealmProgress: ILoadingProgress;
  isCloudTenant: boolean;
  onReconnect: () => void;
  onTabChanged: (tab: Tab) => void;
  syncError?: Realm.Sync.SyncError;
  user: Realm.Sync.User | null;
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
        syncError={this.props.syncError}
        user={this.props.user}
      />
    );
  }
}

export { TopBarContainer as TopBar };
