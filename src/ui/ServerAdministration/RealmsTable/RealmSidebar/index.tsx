import * as React from 'react';

import { RealmSidebar } from './RealmSidebar';

import * as ros from '../../../../services/ros';

export interface IRealmSidebarContainerProps {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  isOpen: boolean;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmTypeUpgrade: (path: string) => void;
  onToggle: () => void;
  realm?: ros.IRealmFile;
}

export interface IRealmSidebarContainerState {
  // We store the realm in the state to render the realm while the sidebar is collapsing
  realm?: ros.IRealmFile;
}

export class RealmSidebarContainer extends React.Component<
  IRealmSidebarContainerProps,
  IRealmSidebarContainerState
> {
  public componentDidUpdate(
    prevProps: IRealmSidebarContainerProps,
    prevState: IRealmSidebarContainerState,
  ) {
    // Update the state if a new realm was passed in via the props.
    if (this.props.realm && prevProps.realm !== this.props.realm) {
      this.setState({ realm: this.props.realm });
    }
  }

  public render() {
    return <RealmSidebar {...this.props} {...this.state} {...this} />;
  }
}

export { RealmSidebarContainer as RealmSidebar };
