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

import { resolve } from 'path';
import Realm from 'realm';
import tmp from 'tmp';

import { ITestRealm } from './index';

import { TYPES as primitiveTypes } from '../ui/RealmBrowser/primitives';

const CustomClass: Realm.ObjectSchema = {
  name: 'CustomClass',
  primaryKey: 'id',
  properties: {
    id: 'string',
    number: 'int',
  },
};

const optionalVariations = [{ optional: true }, { optional: false }];

function capitalize(s: string | undefined) {
  if (s && s.length >= 1) {
    return s.charAt(0).toUpperCase() + s.substr(1);
  } else {
    return s;
  }
}

function generatePropertyName(property: Realm.ObjectSchemaProperty) {
  let result = property.optional ? 'optional' : 'required';
  if (property.type === 'list') {
    result += `ListOf${capitalize(property.objectType)}`;
  } else {
    result += capitalize(property.type);
  }
  return result;
}

function generateSchema() {
  const schema: Realm.ObjectSchema[] = [];
  const types = [...primitiveTypes, 'CustomClass'];
  // Generate permutations of type and optional variations
  for (const type of types) {
    const properties: { [name: string]: Realm.ObjectSchemaProperty } = {};
    // Elements or list of elements
    const typeVariations = [{ type }, { type: 'list', objectType: type }];
    for (const typeVariation of typeVariations) {
      for (const optionalVariation of optionalVariations) {
        const property = { ...typeVariation, ...optionalVariation };
        // Skip the optional list of CustomClass
        if (
          property.type === 'list' &&
          property.objectType === 'CustomClass' &&
          property.optional
        ) {
          continue;
        }
        const name = generatePropertyName(property);
        properties[name] = property;
      }
    }
    // Push a class into the schema with the type related properties
    schema.push({ name: capitalize(type) + 'Properties', properties });
  }
  // Add the CustomClass at the end
  schema.push(CustomClass);
  // Return the list of object schemas
  return schema;
}

export const create = () => {
  const schema = generateSchema();
  const tempDirectory = tmp.dirSync();
  const path = resolve(tempDirectory.name, 'all-types.realm');
  const realm = new Realm({ path, schema }) as ITestRealm;
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
