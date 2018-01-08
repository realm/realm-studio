import * as React from 'react';

import { RealmSidebar } from './RealmSidebar';

import * as ros from '../../../../services/ros';

export interface IRealmSidebarContainerProps {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  isOpen: boolean;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onToggle: () => void;
  realm: ros.IRealmFile | null;
}

export class RealmSidebarContainer extends React.Component<
  IRealmSidebarContainerProps,
  {}
> {
  public render() {
    return <RealmSidebar {...this.props} {...this.state} {...this} />;
  }
}
