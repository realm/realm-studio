import * as React from 'react';

import { RealmSidebar } from './RealmSidebar';

import * as ros from '../../../../services/ros';

export interface IRealmSidebarContainerProps {
  isOpen: boolean;
  realm: ros.IRealmFile | null;
  onRealmDeletion: (path: string) => void;
}

export class RealmSidebarContainer extends React.Component<
  IRealmSidebarContainerProps,
  {}
> {
  public render() {
    return <RealmSidebar {...this.props} {...this.state} {...this} />;
  }
}
