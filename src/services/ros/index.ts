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

import * as realms from './realms';
import * as users from './users';

export { realms, users };
export * from './credentials';

// These interfaces are copied from ROS

export interface IUser {
  userId: string;
  isAdmin: boolean;
  accounts: IAccount[];
  metadata: IUserMetadataRow[];
  status: UserStatus;
}

export type User = IUser & Realm.Object;

export enum UserStatus {
  active = 'active',
  blacklisted = 'blacklisted',
}

export function humanizeUserStatus(userStatus: UserStatus) {
  switch (userStatus) {
    case UserStatus.blacklisted:
      return 'Blacklisted';
    case UserStatus.active:
    default:
      return 'Active';
  }
}

export interface IAccount {
  provider: string;
  providerId: string;
  user?: IUser[];
}

export type Account = IAccount & Realm.Object;

export interface IUserMetadataRow {
  user?: IUser[];
  key: string;
  value?: string;
}

export type UserMetadataRow = IUserMetadataRow & Realm.Object;

export type RealmType = 'reference' | 'partial' | 'full';

export interface IRealmFile {
  path: string;
  syncLabel: string;
  owner: IUser;
  createdAt: Date;
  permissions: IPermission[];
  realmType?: RealmType;
}

export type RealmFile = IRealmFile & Realm.Object;

export interface IPermission {
  user: IUser;
  mayRead: boolean;
  mayWrite: boolean;
  mayManage: boolean;
}

export type Permission = IPermission & Realm.Object;

export enum AccessLevel {
  none,
  read,
  write,
  admin,
}

export interface IRealmSizeInfo {
  stateSize?: number;
  fileSize?: number;
}

// An enum to describe a users role

export enum UserRole {
  Administrator = 'administrator',
  Regular = 'regular',
}

export type Availability =
  | { available: true; version?: string }
  | { available: false };

export const isAvailable = async (url: string): Promise<Availability> => {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.pathname = 'health';
    const response = await fetch(parsedUrl.toString());
    if (response.status === 200) {
      const contentType = response.headers.get('content-type') || '';
      let version: string | undefined;
      if (contentType.indexOf('application/json') !== -1) {
        const body = await response.json();
        version = body.version;
      }

      return { available: true, version };
    }
  } catch {
    // Ignore errors - we'll return unavailable anyway
  }

  return { available: false };
};

export class FetchError extends Error {
  public response: Response;
  public constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export const fetchAuthenticated = async (
  user: Realm.Sync.User,
  path: string,
  options: RequestInit,
  intent: string = 'Failed to fetch',
) => {
  const server = user.server;
  const url = new URL(path, server);
  if (options.headers && options.headers instanceof Headers) {
    options.headers.append('Authorization', user.token);
  } else if (!options.headers) {
    options.headers = new Headers({
      Authorization: user.token,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    });
  }
  const request = new Request(url.toString(), options);
  const response = await fetch(request);
  // Check that the content type is JSON
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.startsWith('application/json');
  // Return parsed JSON or throw an error
  if (response.ok && isJson) {
    return response.json();
  } else if (isJson) {
    const body = await response.json();
    const message = body ? body.message || body.title : null;
    if (message) {
      throw new FetchError(`${intent}: ${message}`, response);
    } else {
      throw new FetchError(intent, response);
    }
  } else {
    throw new FetchError(intent, response);
  }
};
