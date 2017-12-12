import * as Realm from 'realm';

import { IRealmFile, IServerCredentials } from '.';
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
): Promise<Realm> => {
  const url = getUrl(user, realmPath);
  const config = {
    sync: {
      user,
      url,
      error: onCreateRealmErrorCallback,
    },
    schema: [],
  };
  // Using the async Realm.open to now block the UI and wait for the Realm to upload
  return Realm.open(config);
};

export const onCreateRealmErrorCallback = (err: any) => {
  showError('Error while creating new synced realm', err);
};

export const remove = async (user: Realm.Sync.User, realmPath: string) => {
  const server = user.server;
  const encodedUrl = encodeURIComponent(
    realmPath.startsWith('/') ? realmPath.substring(1) : realmPath,
  );
  const url = new URL(`/realms/files/${encodedUrl}`, server);
  const request = new Request(url.toString(), {
    method: 'DELETE',
    headers: new Headers({
      Authorization: user.token,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    }),
  });
  const response = await fetch(request);
  const body = await response.json();
  if (response.ok) {
    return body;
  } else if (body && body.message) {
    throw new Error(`Could not remove Realm: ${body.message}`);
  } else {
    throw new Error(`Could not remove Realm`);
  }
};

export const update = (realmId: string, values: Partial<IRealmFile>) => {
  throw new Error('Not yet implemented');
};
