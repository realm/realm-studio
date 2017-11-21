import * as React from 'react';

import { RealmSidebar } from './RealmSidebar';

import * as ros from '../../../../services/ros';

export interface IRealmSidebarContainerProps {
  isOpen: boolean;
  realm: ros.IRealmFile | null;
  onRealmDeleted: (path: string) => void;
}

export interface IRealmSidebarContainerState {
  deleteRealmModal?: {
    yes: () => void;
    no: () => void;
  };
}

export class RealmSidebarContainer extends React.Component<
  IRealmSidebarContainerProps,
  IRealmSidebarContainerState
> {
  constructor() {
    super();
    this.state = {
      deleteRealmModal: undefined,
    };
  }

  public render() {
    return <RealmSidebar {...this.props} {...this.state} {...this} />;
  }

  public onDeleteRealm = (path: string) => {
    this.setState({
      deleteRealmModal: {
        yes: () => this.props.onRealmDeleted(path),
        no: () => this.setState({ deleteRealmModal: undefined }),
      },
    });
  };
}
