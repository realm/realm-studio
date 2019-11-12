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

import { IServerCredentials } from '.';

export const authenticate = async (
  credentials: IServerCredentials,
): Promise<Realm.Sync.User> => {
  let realmCredentials: Realm.Sync.Credentials;
  if (credentials.kind === 'password') {
    realmCredentials = Realm.Sync.Credentials.usernamePassword(
      credentials.username,
      credentials.password,
      /* createUser*/ false,
    );
  } else if (credentials.kind === 'token') {
    realmCredentials = Realm.Sync.Credentials.adminToken(credentials.token);
  } else if (credentials.kind === 'jwt') {
    realmCredentials = Realm.Sync.Credentials.jwt(
      credentials.token,
      credentials.providerName,
    );
  } else if (credentials.kind === 'other') {
    const options = credentials.options as any;
    realmCredentials = Realm.Sync.Credentials.custom(
      options.provider,
      options.providerToken || options.data || '',
      options.userInfo || options.user_info || {},
    );
  } else {
    throw new Error(`Unexpected kind of credentials`);
  }

  return Realm.Sync.User.login(credentials.url, realmCredentials);
};

export const create = async (
  server: string,
  username: string,
  password: string,
): Promise<string> => {
  // We could create the object in the synced realm, but that wont create the desired username and password
  const credentials = Realm.Sync.Credentials.usernamePassword(
    username,
    password,
    /* createUser */ true,
  );
  const newUser = await Realm.Sync.User.login(server, credentials);
  newUser.logout();
  return newUser.identity;
};

export const remove = async (adminUser: Realm.Sync.User, userId: string) => {
  const server = adminUser.server;
  const url = new URL(`/auth/user/${userId}`, server);
  // TODO: This could be moved to Realm-JS instead
  const request = new Request(url.toString(), {
    method: 'DELETE',
    headers: new Headers({
      Authorization: adminUser.token,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    }),
  });
  // Perform the request
  const response = await fetch(request);
  return response.status === 200;
};

export const updatePassword = async (
  adminUser: Realm.Sync.User,
  userId: string,
  password: string,
) => {
  const server = adminUser.server;
  const url = new URL('/auth/password', server);
  const request = new Request(url.toString(), {
    method: 'PUT',
    headers: new Headers({
      Authorization: adminUser.token,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      user_id: userId,
      data: {
        new_password: password,
      },
    }),
  });
  // Perform the request
  const response = await fetch(request);
  return response.status === 200;
};
