////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as React from 'react';

import { RealmSidebar } from './RealmSidebar';

import * as ros from '../../../../services/ros';

export interface IRealmSidebarContainerProps {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  getRealmStateSize: (path: string) => number | undefined;
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
  public state: IRealmSidebarContainerState = {};

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
