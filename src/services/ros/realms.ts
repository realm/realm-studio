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

import Realm from 'realm';

import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { fetchAuthenticated, IRealmFile, RealmType, UserStatus } from '.';
import { showError } from '../../ui/reusable/errors';

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

export const open = async (params: {
  user: Realm.Sync.User;
  realmPath: string;
  encryptionKey?: Uint8Array;
  ssl: ISslConfiguration;
  progressCallback?: Realm.Sync.ProgressNotificationCallback;
  schema?: Realm.ObjectSchema[];
}): Promise<Realm> => {
  const ssl = params.ssl || { validateCertificates: true };
  const url = getUrl(params.user, params.realmPath);

  let clientResetOcurred = false;

  const realmPromise = Realm.open({
    encryptionKey: params.encryptionKey,
    schema: params.schema,
    path: getPathOnDisk(params.user, params.realmPath),
    sync: {
      url,
      user: params.user,
      error: (session, error) => {
        if (error.name === 'ClientReset') {
          clientResetOcurred = true;
        } else {
          (ssl.errorCallback || defaultSyncErrorCallback)(session, error);
        }
      },
      validate_ssl: ssl.validateCertificates,
      ssl_trust_certificate_path: ssl.certificatePath,
      _disableQueryBasedSyncUrlChecks: true,
    },
  });

  if (params.progressCallback) {
    realmPromise.progress(params.progressCallback);
  }

  const realm = await realmPromise;
  if (clientResetOcurred) {
    realm.close();
    Realm.Sync.initiateClientReset(realm.path);
    return open(params);
  }

  return realm;
};

// We rewrite the path on disk on Windows because default realm paths
// may hit the 260 character limits, especially with partial realms.
const getPathOnDisk = (
  user: Realm.Sync.User,
  realmPath: string,
): string | undefined => {
  // Only Windows has path limits, so it's fine to generate a path from hashes.
  if (process.platform === 'win32') {
    const userSegment = crypto
      .createHash('md5')
      .update(`${user.server}:${user.identity}`)
      .digest('hex');

    const realmPathSegment = crypto
      .createHash('md5')
      .update(realmPath)
      .digest('hex');

    const result = path.join(process.cwd(), userSegment, realmPathSegment);

    // Ensure the parent folder exists as Realm doesn't create it automatically
    fs.ensureDirSync(path.dirname(result));

    return result;
  }
};

export const create = (
  user: Realm.Sync.User,
  realmPath: string,
  schema: Realm.ObjectSchema[] = [],
  validateCertificates = true,
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
        ssl: { validate: validateCertificates },
      },
      schema,
      path: getPathOnDisk(user, realmPath),
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

export const updateUserStatus = async (
  user: Realm.Sync.User,
  userId: string,
  status: UserStatus,
) => {
  return fetchAuthenticated(
    user,
    `/auth/users/${userId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        status,
      }),
    },
    'Failed to update the user status',
  );
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

export const requestSizeRecalculation = (
  user: Realm.Sync.User,
  realmPath: string,
): Promise<void> => {
  const encodedPath = encodeURIComponent(realmPath);
  return fetchAuthenticated(
    user,
    `/realms/calculate-size/${encodedPath}`,
    { method: 'POST' },
    'Failed to request size recalculation',
  );
};
