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

import { Credentials } from 'realm';

export enum RealmLoadingMode {
  Local = 'local',
  Synced = 'synced',
}

export interface IRealmToLoad {
  mode: RealmLoadingMode;
  encryptionKey?: Uint8Array;
}

export interface ILocalRealmToLoad extends IRealmToLoad {
  mode: RealmLoadingMode.Local;
  path: string;
  enableFormatUpgrade?: boolean;
  sync?: boolean;
}

export enum AuthenticationMethod {
  anonymous = 'anonymous',
  emailPassword = 'email-password',
  apiKey = 'api-key',
  jwt = 'jwt',
  // TODO: Add function, apple, google, facebook
}

export type SerializedCredentials =
  | {
      method: AuthenticationMethod.anonymous;
      payload: Record<string, never>;
    }
  | {
      method: AuthenticationMethod.emailPassword;
      payload: {
        email: string;
        password: string;
      };
    }
  | {
      method: AuthenticationMethod.jwt;
      payload: {
        token: string;
      };
    }
  | {
      method: AuthenticationMethod.apiKey;
      payload: {
        apiKey: string;
      };
    };

export interface ISyncedRealmToLoad extends IRealmToLoad {
  mode: RealmLoadingMode.Synced;
  serverUrl: string;
  appId: string;
  credentials: SerializedCredentials;
}

export type RealmToLoad = ILocalRealmToLoad | ISyncedRealmToLoad;

export function hydrateCredentials({
  method,
  payload,
}: SerializedCredentials): Credentials {
  switch (method) {
    case AuthenticationMethod.anonymous:
      return Credentials.anonymous();
    case AuthenticationMethod.emailPassword:
      return Credentials.emailPassword(payload.email, payload.password);
    case AuthenticationMethod.apiKey:
      return Credentials.apiKey(payload.apiKey);
    case AuthenticationMethod.jwt:
      return Credentials.jwt(payload.token);
    default:
      throw new Error(`The method is not supported: ${method}`);
  }
}
