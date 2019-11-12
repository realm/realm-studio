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

function serializeObject(object: { [key: string]: any } & Realm.Object) {
  // This is an object reference
  const objectSchema = object.objectSchema();
  if (objectSchema.primaryKey) {
    return object[objectSchema.primaryKey];
  } else {
    // Shallow copy the object
    return RealmObjectToJSON.call(object);
  }
}

function serializeValue(propertyName: string, value: any) {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (value instanceof ArrayBuffer) {
    return Buffer.from(value).toString('base64');
  } else if (
    typeof value === 'object' &&
    typeof value.objectSchema === 'function'
  ) {
    return serializeObject(value);
  } else if (typeof value === 'object' && typeof value.length === 'number') {
    if (value.type === 'object') {
      // A list of objects
      return value.map((item: any) => {
        if (typeof item === 'object') {
          return serializeObject(item);
        } else {
          return item;
        }
      });
    } else {
      // A list of primitives
      return [...value];
    }
  } else {
    throw new Error(
      `Failed to serialize '${propertyName}' field of type ${typeof value}`,
    );
  }
}

function RealmObjectToJSON(this: { [key: string]: any } & Realm.Object) {
  const values: { [key: string]: any } = {};
  for (const propertyName of Object.getOwnPropertyNames(this)) {
    const value = this[propertyName];
    if (propertyName === '_realm' || typeof value === 'function') {
      continue; // Skip this property
    } else {
      values[propertyName] = serializeValue(propertyName, value);
    }
  }
  return values;
}

export class JSONExportEngine implements IExportEngine {
  public export(realm: Realm, destinationPath: string) {
    const data: { [objectSchemaName: string]: any[] } = {};
    for (const objectSchema of realm.schema) {
      data[objectSchema.name] = [
        ...realm.objects(objectSchema.name).snapshot(),
      ].map((object: any) => {
        return Object.defineProperty(object, 'toJSON', {
          value: RealmObjectToJSON.bind(object),
          enumerable: false,
        });
      });
    }
    // Write the stringified data to a file
    fs.writeFileSync(destinationPath, JSON.stringify(data, null, 2));
  }
}
