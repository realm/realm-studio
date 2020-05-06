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

import electron from 'electron';
import memoize from 'memoize-one';
import React from 'react';
import Realm from 'realm';
import semver from 'semver';

import * as ros from '../../../services/ros';
import { store } from '../../../store';
import { showError } from '../../reusable/errors';
import { withAdminRealm } from '../AdminRealm';
import {
  getMetricsRealmConfig,
  IRealmFileSize,
  IRealmStateSize,
  MetricsRealmProvider,
} from '../MetricsRealm';
import { getQueryForFields } from '../utils';

import { RealmsTable } from './RealmsTable';

export type MetricGetter = (
  realm: RealmFile,
  name: 'RealmStateSize' | 'RealmFileSize',
) => IRealmStateSize | IRealmFileSize | undefined;

export type RealmFile = ros.IRealmFile & Realm.Object;

export interface IDeletionProgress {
  current: number;
  total: number;
}

export interface IRealmTableContainerProps {
  adminRealm: Realm;
  createRealm: () => Promise<RealmFile>;
  onRealmOpened: (path: string, usingGrahpiql?: boolean) => void;
  user: Realm.Sync.User;
  serverVersion?: string;
}

export interface IRealmTableContainerState {
  /** Prevents spamming the server too badly */
  deletionProgress?: IDeletionProgress;
  searchString: string;
  queryError?: Error;
  // TODO: Update this once Realm JS has better support for Sets
  selectedRealms: RealmFile[];
  showPartialRealms: boolean;
  showSystemRealms: boolean;
}

class RealmsTableContainer extends React.Component<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  public state: IRealmTableContainerState = {
    selectedRealms: [],
    searchString: '',
    showPartialRealms: store.shouldShowPartialRealms(),
    showSystemRealms: store.shouldShowSystemRealms(),
  };

  private realms = memoize(
    (
      adminRealm: Realm,
      searchString: string,
      showPartialRealms: boolean,
      showSystemRealms: boolean,
    ) => {
      let queryError: Error | undefined;
      let realms = adminRealm
        .objects<RealmFile>('RealmFile')
        .sorted('createdAt');

      // Filter if a search string is specified
      if (searchString || searchString !== '') {
        const filterQuery = getQueryForFields(
          ['path', 'realmType', 'owner.accounts.providerId'],
          searchString,
        );
        try {
          realms = realms.filtered(filterQuery);
        } catch (err) {
          queryError = err;
          // tslint:disable-next-line:no-console
          console.warn(`Could not filter on "${filterQuery}"`, err);
        }
      }

      // Filter out System and Partial Realms based on global preferences
      if (showPartialRealms === false) {
        realms = realms.filtered("NOT path CONTAINS '/__partial/'");
      }
      if (showSystemRealms === false) {
        // Hide all system realms, including the old Permission system Realms,
        // but make sure to not hide partial Realms.
        realms = realms.filtered(
          [
            "NOT path BEGINSWITH '/__'",
            "NOT path ENDSWITH '__management'",
            "NOT path ENDSWITH '__perm'",
            "NOT path ENDSWITH '__permission'",
          ].join(' AND '),
        );
      }
      return { realms, queryError };
    },
  );

  private metricsRealm: Realm | null = null;

  public render() {
    const { adminRealm } = this.props;
    if (adminRealm.empty || !adminRealm.syncSession) {
      return null;
    }

    const hasMetricsRealm =
      adminRealm.objectForPrimaryKey('RealmFile', '/__metrics') !== undefined;

    // Generate a configuration to open the /__metrics Realm
    const metricsRealmConfig = getMetricsRealmConfig(
      adminRealm.syncSession.user,
    );
    // Render with the /__metrics Realm only if it was already created by the Server
    return hasMetricsRealm ? (
      <MetricsRealmProvider {...metricsRealmConfig} updateOnChange={true}>
        {({ realm: metricsRealm }) => {
          // Hang onto the metrics Realm when it gets opened
          this.metricsRealm = metricsRealm;
          // Render the presentational component
          return this.renderTable();
        }}
      </MetricsRealmProvider>
    ) : (
      this.renderTable()
    );
  }

  public componentDidMount() {
    store.onDidChange(store.KEY_SHOW_PARTIAL_REALMS, (newVal, oldVal) => {
      if (oldVal !== newVal) {
        const val = newVal === true;
        this.setState({ showPartialRealms: val });
      }
    });

    store.onDidChange(store.KEY_SHOW_SYSTEM_REALMS, (newVal, oldVal) => {
      if (oldVal !== newVal) {
        const val = newVal === true;
        this.setState({ showSystemRealms: val });
      }
    });
  }

  public getRealmPermissions = (
    realm: RealmFile,
  ): Realm.Results<ros.IPermission> => {
    const { adminRealm } = this.props;
    return adminRealm
      .objects<ros.IPermission>('Permission')
      .filtered('realmFile == $0', realm);
  };

  public getMetric: MetricGetter = (
    realm: RealmFile,
    name: 'RealmStateSize' | 'RealmFileSize',
  ) => {
    if (
      this.metricsRealm &&
      !this.metricsRealm.isClosed &&
      !this.metricsRealm.empty
    ) {
      return this.metricsRealm.objectForPrimaryKey<IRealmStateSize>(
        name,
        realm.path,
      );
    }
  };

  public shouldShowRealmSize = (serverVersion?: string): boolean => {
    return semver.gte(serverVersion || '0.0.0', '3.13.0');
  };

  public onRealmCreation = async () => {
    try {
      const realm = await this.props.createRealm();
      this.setState({ selectedRealms: [realm] });
    } catch (err) {
      if (err.message === 'Realm creation cancelled') {
        // This is an expected expression to be thrown - no need to show it
        return;
      }
      showError('Failed to create Realm', err);
    }
  };

  public onRealmSizeRecalculate = async (realm: RealmFile) => {
    await ros.realms.requestSizeRecalculation(this.props.user, realm.path);
  };

  public onRealmDeletion = async (...realms: RealmFile[]) => {
    const confirmed = this.confirmRealmDeletion(...realms);
    if (confirmed) {
      try {
        for (let i = 0; i < realms.length; i++) {
          this.setState({
            deletionProgress: { current: i, total: realms.length },
          });
          const realm = realms[i];
          await ros.realms.remove(this.props.user, realm.path);
        }
      } catch (err) {
        showError('Error deleting realm(s)', err);
      }
      // No matter what - reset the deletionProgress when done
      this.setState({ deletionProgress: undefined });
      this.onRealmsDeselection();
    }
  };

  public onRealmOpened = (realm: RealmFile, usingGrahpiql = false) => {
    this.props.onRealmOpened(realm.path, usingGrahpiql);
  };
  public onRealmClick = (
    e: React.MouseEvent<HTMLElement>,
    realm: RealmFile,
  ) => {
    const isCurrentlySelected = !!this.state.selectedRealms.find(
      r => r.isValid() && r.path === realm.path,
    );
    if (e.metaKey) {
      // The user wants to modify the existing selection
      if (isCurrentlySelected) {
        this.deselectRealm(realm);
      } else {
        this.selectRealm(realm, true);
      }
    } else if (e.shiftKey && this.state.selectedRealms.length > 0) {
      const lastRealm = this.state.selectedRealms[
        this.state.selectedRealms.length - 1
      ];
      this.selectRealmsBetween(lastRealm, realm);
    } else {
      // The user wants to make a new selection
      this.selectRealm(realm, false);
    }
  };

  public onRealmsDeselection = () => {
    this.setState({ selectedRealms: [] });
  };

  public onSearchStringChange = (searchString: string) => {
    this.setState({ searchString });
  };

  private renderTable() {
    const { realms, queryError } = this.realms(
      this.props.adminRealm,
      this.state.searchString,
      this.state.showPartialRealms,
      this.state.showSystemRealms,
    );
    const validSelectedRealms = this.state.selectedRealms.filter(r => {
      // Filter out the Realm objects
      const realm: Realm.Object = r as any;
      return realm.isValid();
    });
    // Only display the realm sizes if the metrics Realm is opened and not empty
    const shouldShowRealmSize = !!(
      this.metricsRealm && !this.metricsRealm.empty
    );
    return (
      <RealmsTable
        getRealmPermissions={this.getRealmPermissions}
        getMetric={this.getMetric}
        onRealmCreation={this.onRealmCreation}
        onRealmDeletion={this.onRealmDeletion}
        onRealmOpened={this.onRealmOpened}
        onRealmsDeselection={this.onRealmsDeselection}
        onRealmClick={this.onRealmClick}
        onSearchStringChange={this.onSearchStringChange}
        realms={realms}
        searchString={this.state.searchString}
        queryError={queryError}
        selectedRealms={validSelectedRealms}
        deletionProgress={this.state.deletionProgress}
        onRealmSizeRecalculate={this.onRealmSizeRecalculate}
        shouldShowRealmSize={shouldShowRealmSize}
      />
    );
  }

  private confirmRealmDeletion(...realms: RealmFile[]): boolean {
    const paths = realms.map(r => r.path);
    const result = electron.remote.dialog.showMessageBoxSync(
      electron.remote.getCurrentWindow(),
      {
        type: 'warning',
        message:
          'Before deleting Realms here, make sure that any / all clients (iOS, Android, Js, etc.) has already deleted the app or database locally. If this is not done, they will try to upload their copy of the database - which might have been replaced in the meantime.',
        title: `Deleting ${paths.join(', ')}`,
        buttons: ['Cancel', 'Delete'],
      },
    );

    return result === 1;
  }

  private selectRealm(realm: RealmFile, append = false) {
    if (append) {
      const { selectedRealms } = this.state;
      const validSelectedRealms = selectedRealms.filter(r => r.isValid());
      this.setState({ selectedRealms: [...validSelectedRealms, realm] });
    } else {
      this.setState({ selectedRealms: [realm] });
    }
  }

  private deselectRealm(realm: RealmFile) {
    this.setState({
      selectedRealms: this.state.selectedRealms.filter(
        r => r.isValid() && r.path !== realm.path,
      ),
    });
  }

  private getRealmsBetween(realmA: RealmFile, realmB: RealmFile) {
    const { realms } = this.realms(
      this.props.adminRealm,
      this.state.searchString,
      this.state.showPartialRealms,
      this.state.showSystemRealms,
    );
    const realmAIndex = realms.indexOf(realmA);
    const realmBIndex = realms.indexOf(realmB);
    const startIndex = Math.min(realmAIndex, realmBIndex);
    const endIndex = Math.max(realmAIndex, realmBIndex);
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push(realms[i]);
    }
    return result;
  }

  private selectRealmsBetween(realmA: RealmFile, realmB: RealmFile) {
    const realmsBetween = this.getRealmsBetween(realmA, realmB);
    this.setState({ selectedRealms: realmsBetween });
  }
}

const RealmTableWithRealm = withAdminRealm(RealmsTableContainer, 'adminRealm', {
  updateOnChange: true,
});

export { RealmTableWithRealm as RealmsTable };
