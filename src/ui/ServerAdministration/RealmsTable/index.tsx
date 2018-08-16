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

import * as electron from 'electron';
import memoize from 'memoize-one';
import * as React from 'react';
import * as Realm from 'realm';

import * as ros from '../../../services/ros';
import { store } from '../../../store';

import { showError } from '../../reusable/errors';
import { querySomeFieldContainsText, wait } from '../utils';
import { RealmsTable } from './RealmsTable';

export type RealmFile = ros.IRealmFile & Realm.Object;

export type ValidateCertificatesChangeHandler = (
  validateCertificates: boolean,
) => void;

export interface IDeletionProgress {
  current: number;
  total: number;
}

export interface IRealmTableContainerProps {
  adminRealm: Realm;
  adminRealmChanges: number;
  createRealm: () => Promise<RealmFile>;
  onRealmOpened: (path: string) => void;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
  user: Realm.Sync.User;
  validateCertificates: boolean;
  serverVersion?: string;
}

export interface IRealmTableContainerState {
  /** Prevents spamming the server too badly */
  deletionProgress?: IDeletionProgress;
  isFetchRealmSizes: boolean;
  realmStateSizes?: { [path: string]: number };
  searchString: string;
  // TODO: Update this once Realm JS has better support for Sets
  selectedRealms: RealmFile[];
  showPartialRealms: boolean;
  showSystemRealms: boolean;
}

class RealmsTableContainer extends React.PureComponent<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  public state: IRealmTableContainerState = {
    isFetchRealmSizes: false,
    selectedRealms: [],
    searchString: '',
    showPartialRealms: store.shouldShowPartialRealms(),
    showSystemRealms: store.shouldShowSystemRealms(),
  };

  protected realms = memoize(
    (
      adminRealm: Realm,
      searchString: string,
      showPartialRealms: boolean,
      showSystemRealms: boolean,
    ) => {
      let realms = adminRealm
        .objects<RealmFile>('RealmFile')
        .sorted('createdAt');

      // Filter if a search string is specified
      if (searchString || searchString !== '') {
        const filterQuery = querySomeFieldContainsText(
          ['path', 'realmType', 'owner.accounts.providerId'],
          searchString,
        );
        try {
          realms = realms.filtered(filterQuery);
        } catch (err) {
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
      return realms;
    },
  );

  public render() {
    const realms = this.realms(
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
    return (
      <RealmsTable
        getRealmPermissions={this.getRealmPermissions}
        getRealmStateSize={this.getRealmStateSize}
        isFetchRealmSizes={this.state.isFetchRealmSizes}
        onRealmCreation={this.onRealmCreation}
        onRealmDeletion={this.onRealmDeletion}
        onRealmOpened={this.onRealmOpened}
        onRealmsDeselection={this.onRealmsDeselection}
        onRealmClick={this.onRealmClick}
        onRealmStateSizeRefresh={this.onRealmStateSizeRefresh}
        onRealmTypeUpgrade={this.onRealmTypeUpgrade}
        onSearchStringChange={this.onSearchStringChange}
        realms={realms}
        realmStateSizes={this.state.realmStateSizes}
        searchString={this.state.searchString}
        selectedRealms={validSelectedRealms}
        deletionProgress={this.state.deletionProgress}
      />
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

    // Fetch the realm sizes
    // TODO: Check the this.props.serverVersion before fetching using the semver library
    this.fetchRealmSizes().then(undefined, err => {
      // Logging errors instead of showing them, because the user made no interaction
      // tslint:disable-next-line:no-console
      console.error('Failed to fetch Realm sizes', err);
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

  public getRealmStateSize = (realm: RealmFile) => {
    if (this.state.realmStateSizes) {
      return this.state.realmStateSizes[realm.path];
    }
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

  public onRealmOpened = (realm: RealmFile) => {
    this.props.onRealmOpened(realm.path);
  };

  public onRealmTypeUpgrade = async (realm: RealmFile) => {
    const confirmed = this.confirmRealmTypeUpgrade(realm.path);
    if (confirmed) {
      try {
        await ros.realms.changeType(this.props.user, realm.path, 'reference');
      } catch (err) {
        showError('Failed to upgrade the Realm', err);
      }
    }
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

  public onRealmStateSizeRefresh = () => {
    // Fetch the realm sizes
    this.fetchRealmSizes(true).then(undefined, err => {
      showError('Failed to fetch Realm sizes', err);
    });
  };

  public onRealmsDeselection = () => {
    this.setState({ selectedRealms: [] });
  };

  public onSearchStringChange = (searchString: string) => {
    this.setState({ searchString });
  };

  private async fetchRealmSizes(askServerToReport = false) {
    if (!this.state.isFetchRealmSizes) {
      try {
        this.setState({ isFetchRealmSizes: true });
        if (askServerToReport) {
          // Ask the server to recompute the realm sizes
          await ros.realms.reportRealmStateSize(this.props.user);
          // Wait half 200ms for the server to complete
          // FIXME: This delay is a best guess - it could easily take longer time for the server to emit and process stats
          await wait(1000);
        }
        // Request the realm sizes from the server
        const sizes = await ros.realms.getSizes(this.props.user);
        // Update the state
        this.setState({ realmStateSizes: sizes });
      } catch (err) {
        if (err instanceof ros.FetchError && err.response.status === 404) {
          // This is expected from an older server
          // - but we should really check the version before fetching instead ...
        } else {
          throw err;
        }
      } finally {
        this.setState({ isFetchRealmSizes: false });
      }
    }
  }

  private confirmRealmDeletion(...realms: RealmFile[]): boolean {
    const paths = realms.map(r => r.path);
    const result = electron.remote.dialog.showMessageBox(
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

  private confirmRealmTypeUpgrade(path: string): boolean {
    const result = electron.remote.dialog.showMessageBox(
      electron.remote.getCurrentWindow(),
      {
        type: 'warning',
        message:
          'Upgrading the Realm to be a Reference Realm will delete all current permissions for it. WARNING: This operation cannot be reverted.',
        title: `Upgrading type of ${path}`,
        buttons: ['Cancel', 'Upgrade to "reference" Realm'],
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
    const realms = this.realms(
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

export { RealmsTableContainer as RealmsTable };
