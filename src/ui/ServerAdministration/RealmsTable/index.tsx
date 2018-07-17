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

export type ValidateCertificatesChangeHandler = (
  validateCertificates: boolean,
) => void;

export interface IRealmTableContainerProps {
  adminRealm: Realm;
  adminRealmChanges: number;
  createRealm: () => Promise<ros.IRealmFile>;
  onRealmOpened: (path: string) => void;
  onValidateCertificatesChange: ValidateCertificatesChangeHandler;
  user: Realm.Sync.User;
  validateCertificates: boolean;
  serverVersion?: string;
}

export interface IRealmTableContainerState {
  /** Prevents spamming the server too badly */
  isFetchRealmSizes: boolean;
  realmStateSizes?: { [path: string]: number };
  searchString: string;
  selectedRealmPath: string | null;
  showPartialRealms: boolean;
  showSystemRealms: boolean;
}

class RealmsTableContainer extends React.PureComponent<
  IRealmTableContainerProps,
  IRealmTableContainerState
> {
  public state: IRealmTableContainerState = {
    isFetchRealmSizes: false,
    selectedRealmPath: null,
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
        .objects<ros.IRealmFile>('RealmFile')
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
    return (
      <RealmsTable
        getRealmFromId={this.getRealmFromId}
        getRealmPermissions={this.getRealmPermissions}
        getRealmStateSize={this.getRealmStateSize}
        isFetchRealmSizes={this.state.isFetchRealmSizes}
        onRealmCreation={this.onRealmCreation}
        onRealmDeletion={this.onRealmDeletion}
        onRealmOpened={this.onRealmOpened}
        onRealmSelected={this.onRealmSelected}
        onRealmStateSizeRefresh={this.onRealmStateSizeRefresh}
        onRealmTypeUpgrade={this.onRealmTypeUpgrade}
        onSearchStringChange={this.onSearchStringChange}
        realms={realms}
        realmStateSizes={this.state.realmStateSizes}
        searchString={this.state.searchString}
        selectedRealmPath={this.state.selectedRealmPath}
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
      showError('Failed to fetch Realm sizes', err);
    });
  }

  public getRealmFromId = (path: string): ros.IRealmFile | undefined => {
    const { adminRealm } = this.props;
    return adminRealm.objectForPrimaryKey<ros.IRealmFile>('RealmFile', path);
  };

  public getRealmPermissions = (
    path: string,
  ): Realm.Results<ros.IPermission> => {
    const { adminRealm } = this.props;
    const realmFile = this.getRealmFromId(path);
    return adminRealm
      .objects<ros.IPermission>('Permission')
      .filtered('realmFile == $0', realmFile);
  };

  public getRealmStateSize = (path: string) => {
    if (this.state.realmStateSizes) {
      return this.state.realmStateSizes[path];
    }
  };

  public onRealmCreation = async () => {
    try {
      const realm = await this.props.createRealm();
      this.onRealmSelected(realm.path);
    } catch (err) {
      if (err.message === 'Realm creation cancelled') {
        // This is an expected expression to be thrown - no need to show it
        return;
      }
      showError('Failed to create Realm', err);
    }
  };

  public onRealmDeletion = async (path: string) => {
    const confirmed = this.confirmRealmDeletion(path);
    if (confirmed) {
      try {
        await ros.realms.remove(this.props.user, path);
        if (path === this.state.selectedRealmPath) {
          this.onRealmSelected(null);
        }
      } catch (err) {
        showError('Error deleting realm', err);
      }
    }
  };

  public onRealmOpened = (path: string) => {
    this.props.onRealmOpened(path);
    // Make sure the Realm that just got opened, is selected
    this.onRealmSelected(path);
  };

  public onRealmTypeUpgrade = async (path: string) => {
    const confirmed = this.confirmRealmTypeUpgrade(path);
    if (confirmed) {
      try {
        await ros.realms.changeType(this.props.user, path, 'reference');
      } catch (err) {
        showError('Failed to upgrade the Realm', err);
      }
    }
  };

  public onRealmSelected = (path: string | null) => {
    this.setState({
      selectedRealmPath: path,
    });
  };

  public onRealmStateSizeRefresh = () => {
    // Fetch the realm sizes
    this.fetchRealmSizes(true).then(undefined, err => {
      showError('Failed to fetch Realm sizes', err);
    });
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

  private confirmRealmDeletion(path: string): boolean {
    const result = electron.remote.dialog.showMessageBox(
      electron.remote.getCurrentWindow(),
      {
        type: 'warning',
        message:
          'Before deleting the Realm here, make sure that any / all clients (iOS, Android, Js, etc.) has already deleted the app or database locally. If this is not done, they will try to upload their copy of the database - which might have been replaced in the meantime.',
        title: `Deleting ${path}`,
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
}

export { RealmsTableContainer as RealmsTable };
