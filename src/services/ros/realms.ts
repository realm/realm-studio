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

import * as Realm from 'realm';

import {
  fetchAuthenticated,
  IRealmFile,
  IServerCredentials,
  RealmType,
} from '.';
import { showError } from '../../ui/reusable/errors';

export enum RealmLoadingMode {
  Synced = 'synced',
  Local = 'local',
}

export interface IRealmToLoad {
  mode: RealmLoadingMode;
  path: string;
  encryptionKey?: Uint8Array;
}

export interface ISyncedRealmToLoad extends IRealmToLoad {
  mode: RealmLoadingMode.Synced;
  authentication: IServerCredentials | Realm.Sync.User;
  validateCertificates: boolean;
}

export interface ILocalRealmToLoad extends IRealmToLoad {
  mode: RealmLoadingMode.Local;
  sync?: boolean;
}

export interface ISslConfiguration {
  validateCertificates: boolean;
  errorCallback?: Realm.Sync.ErrorCallback;
  certificatePath?: string;
}

export const defaultSyncErrorCallback = (sender: any, err: any) => {
  showError('Error while synchronizing Realm', err);
};

export const getUrl = (user: Realm.Sync.User, realmPath: string) => {
  const url = new URL(realmPath, user.server);
  url.protocol = url.protocol === 'https:' ? 'realms:' : 'realm:';
  return url.toString();
};

export const open = async (
  user: Realm.Sync.User,
  realmPath: string,
  encryptionKey?: Uint8Array,
  ssl: ISslConfiguration = { validateCertificates: true },
  progressCallback?: Realm.Sync.ProgressNotificationCallback,
  schema?: Realm.ObjectSchema[],
): Promise<Realm> => {
  const url = getUrl(user, realmPath);

  const realm = Realm.open({
    encryptionKey,
    schema,
    sync: {
      url,
      user,
      error: ssl.errorCallback || defaultSyncErrorCallback,
      validate_ssl: ssl.validateCertificates,
      ssl_trust_certificate_path: ssl.certificatePath,
      _disableQueryBasedSyncUrlChecks: true,
    },
  });

  if (progressCallback) {
    realm.progress(progressCallback);
  }

  return realm;
};

export const create = (
  user: Realm.Sync.User,
  realmPath: string,
  schema: Realm.ObjectSchema[] = [],
): Promise<Realm> => {
  return new Promise((resolve, reject) => {
    const url = getUrl(user, realmPath);
    // Using the async Realm.open to allow the caller to know when the Realm to got uploaded
    Realm.open({
      sync: {
        user,
        url,
        error: (session, err) => {
          reject(err);
        },
      },
      schema,
    }).then(resolve, reject);
  });
};

export const remove = async (user: Realm.Sync.User, realmPath: string) => {
  const encodedPath = encodeURIComponent(realmPath);
  return fetchAuthenticated(
    user,
    `/realms/files/${encodedPath}`,
    { method: 'DELETE' },
    `Could not remove Realm`,
  );
};

export const changeType = async (
  user: Realm.Sync.User,
  realmPath: string,
  type: RealmType,
) => {
  const encodedPath = encodeURIComponent(realmPath);
  return fetchAuthenticated(
    user,
    `/realms/files/${encodedPath}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        realmType: type,
      }),
    },
    'Failed to change type of the Realm',
  );
};

export const update = (realmId: string, values: Partial<IRealmFile>) => {
  throw new Error('Not yet implemented');
};

interface IStatisticsResponse {
  [metricName: string]: Array<{
    labels: { [name: string]: string };
    value: number;
  }>;
}

export const getStats = async (
  user: Realm.Sync.User,
  metricNames: string,
): Promise<IStatisticsResponse> => {
  return fetchAuthenticated(
    user,
    `/stats/instant/${metricNames}`,
    { method: 'GET' },
    'Failed to get statistics',
  );
};

export const reportRealmStateSize = async (
  user: Realm.Sync.User,
  path: string = '',
) => {
  return fetchAuthenticated(
    user,
    `/stats/report-realm-state-size/${path}`,
    { method: 'POST' },
    'Failed to report realm state size',
  );
};

export const getSizes = async (user: Realm.Sync.User) => {
  const metrics = await getStats(user, 'ros_sync_realm_state_size');
  if (metrics.ros_sync_realm_state_size) {
    const result: { [path: string]: number } = {};
    const sizeMetric = metrics.ros_sync_realm_state_size;
    for (const stat of sizeMetric) {
      if (stat.labels.path) {
        // The paths are URI encoded
        const path = decodeURIComponent(stat.labels.path);
        result[path] = stat.value;
      }
    }
    return result;
  } else {
    throw new Error("Expected 'ros_sync_realm_state_size' in response");
  }
};
