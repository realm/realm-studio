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

import * as Realm from 'realm';

import { isPrimitive } from './primitives';

export const addProperty = (
  objectSchemas: Realm.ObjectSchema[],
  className: string,
  propertyName: string,
  propertyType: Realm.PropertyType,
) => {
  return objectSchemas.map(schema => {
    if (schema.name === className) {
      // Return the modified object schema
      return {
        ...schema,
        properties: {
          ...schema.properties,
          [propertyName]: propertyType,
        },
      };
    } else {
      return schema;
    }
  });
};

function cleanUpProperty(
  property: Realm.ObjectSchemaProperty,
): Realm.ObjectSchemaProperty | string {
  if (
    property.type === 'list' &&
    property.objectType &&
    isPrimitive(property.objectType)
  ) {
    return `${property.objectType}${property.optional ? '?' : ''}[]`;
  } else {
    return property;
  }
}

// A mitigation before https://github.com/realm/realm-js/issues/1847 gets fixed
export const cleanUpSchema = (objectSchemas: Realm.ObjectSchema[]) => {
  return objectSchemas.map(schema => {
    const properties: Realm.PropertiesTypes = {};
    for (const [name, property] of Object.entries(schema.properties)) {
      properties[name] =
        typeof property === 'string' ? property : cleanUpProperty(property);
    }
    // Return the modified object schema
    return {
      ...schema,
      properties,
    };
  });
};
