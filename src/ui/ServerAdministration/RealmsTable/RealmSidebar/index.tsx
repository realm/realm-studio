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

import { IPermission, IRealmSize } from '../../../../services/ros';

import { IDeletionProgress, RealmFile } from '..';

export interface IRealmSidebarContainerProps {
  deletionProgress?: IDeletionProgress;
  getRealmPermissions: (realm: RealmFile) => Realm.Results<IPermission>;
  getRealmSize: (realm: RealmFile) => IRealmSize | undefined;
  isOpen: boolean;
  onRealmDeletion: (...realms: RealmFile[]) => void;
  onRealmOpened: (realm: RealmFile) => void;
  onRealmTypeUpgrade: (realm: RealmFile) => void;
  onClose: () => void;
  realms: RealmFile[];
}

export interface IRealmSidebarContainerState {
  // We store the realm in the state to render the realm while the sidebar is collapsing
  realms: RealmFile[];
}

export class RealmSidebarContainer extends React.Component<
  IRealmSidebarContainerProps,
  IRealmSidebarContainerState
> {
  public state: IRealmSidebarContainerState = {
    realms: [],
  };

  public componentDidUpdate(prevProps: IRealmSidebarContainerProps) {
    // Update the state if a new realm was passed in via the props.
    if (this.props.realms && prevProps.realms !== this.props.realms) {
      this.setState({ realms: this.props.realms });
    }
  }

  public render() {
    // Because we copy the list of Realms, they might be invalidated or deleted
    const realms = this.state.realms || this.props.realms;
    const validRealms = realms.filter(r => {
      // Filter out the Realm objects
      const realm: Realm.Object = r as any;
      return realm.isValid();
    });
    return (
      <RealmSidebar
        deletionProgress={this.props.deletionProgress}
        getRealmPermissions={this.props.getRealmPermissions}
        getRealmSize={this.props.getRealmSize}
        isOpen={this.props.isOpen}
        onRealmDeletion={this.props.onRealmDeletion}
        onRealmOpened={this.props.onRealmOpened}
        onRealmTypeUpgrade={this.props.onRealmTypeUpgrade}
        onClose={this.props.onClose}
        realms={validRealms}
      />
    );
  }
}

export { RealmSidebarContainer as RealmSidebar };
