import * as React from 'react';

import { RealmSidebar } from './RealmSidebar';

export interface IRealmSidebarContainerProps {
  isOpen: boolean;
}

export class RealmSidebarContainer extends React.Component<
  IRealmSidebarContainerProps,
  {}
> {
  constructor() {
    super();
  }

  public render() {
    return <RealmSidebar {...this.props} {...this.state} {...this} />;
  }
}
