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
import keytar from 'keytar';

import * as ros from '../../services/ros';

const SERVICE_NAME = electron.remote.app.getName();

export const setCredentials = (credentials: ros.IServerCredentials) => {
  return keytar.setPassword(
    SERVICE_NAME,
    credentials.url,
    JSON.stringify(credentials),
  );
};

export const getCredentials = async (
  url: string | null,
): Promise<ros.IServerCredentials | null> => {
  if (!url) {
    return null;
  }
  const result = await keytar.getPassword(SERVICE_NAME, url);
  if (result) {
    return JSON.parse(result);
  } else {
    return null;
  }
};

export const unsetCredentials = async (url: string) => {
  return keytar.deletePassword(SERVICE_NAME, url);
};
