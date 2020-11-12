////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Realm Inc.
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

import { resolve } from 'path';
import Realm from 'realm';
import tmp from 'tmp';

import { ITestRealm } from './index';

export const create = (key: string) => {
  const encryptionKey = Buffer.from(key, 'hex');
  const schema = [{ name: 'Item', properties: { title: 'string' } }];
  const tempDirectory = tmp.dirSync();
  const path = resolve(tempDirectory.name, 'encrypted-types.realm');
  const realm = new Realm({ path, schema, encryptionKey }) as ITestRealm;
  // Implement a method to close and delete the Realm
  realm.closeAndDelete = () => {
    realm.close();
    // Delete the Realm file
    Realm.deleteFile({
      path: realm.path,
    });
    // Delete the temporary directory
    tempDirectory.removeCallback();
  };
  // Return the Realm
  return realm;
};
