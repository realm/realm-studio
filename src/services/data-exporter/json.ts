////////////////////////////////////////////////////////////////////////////
//
// Copyright 2019 Realm Inc.
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

import fs from 'fs-extra';
import Realm from 'realm';

import { IExportEngine } from '.';

const INDENTATION_SPACES = 2;
const CIRCULAR_ERROR_REGEX_CHECK = /circular|cyclic/i;

// Note: Do not call Realm.JsonSerializationReplacer directly, as it's a getter
// it will return a new function at each run, bypassing the circular detection.
const RealmJsonSerializationReplacer = Realm.JsonSerializationReplacer;

type StudioSerializationReplacer = (
  this: StudioSerializationReplacer,
  key: string,
  value: any,
) => any;

function standardReplacer(_: string, value: any) {
  return value instanceof ArrayBuffer
    ? Buffer.from(value).toString('base64')
    : value;
}

function circularReplacer(
  this: StudioSerializationReplacer,
  key: string,
  value: any,
) {
  return RealmJsonSerializationReplacer.call(
    this,
    key,
    standardReplacer(key, value),
  );
}

type ResultMap = {
  [key: string]: Realm.Results<Realm.Object>;
};

const serialize = (map: ResultMap) => {
  try {
    // First try default stringify to avoid Realm.JsonSerializationReplacer
    // adding unnecessary `$refId` to the output.
    return JSON.stringify(map, standardReplacer, INDENTATION_SPACES);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (CIRCULAR_ERROR_REGEX_CHECK.test(message)) {
      // If a circular structure is detected, serialize using Realm.JsonSerializationReplacer
      return JSON.stringify(map, circularReplacer, INDENTATION_SPACES);
    }
    throw err;
  }
};

export class JSONExportEngine implements IExportEngine {
  public export(realm: Realm, destinationPath: string) {
    const resultMap: ResultMap = realm.schema.reduce(
      (map: ResultMap, objectSchema) => {
        if (!objectSchema.embedded) {
          map[objectSchema.name] = realm.objects(objectSchema.name).snapshot();
        }
        return map;
      },
      {},
    );

    // Write the stringified data to a file
    fs.writeFileSync(destinationPath, serialize(resultMap));
  }
}
