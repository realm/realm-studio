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

import * as classnames from 'classnames';
import * as React from 'react';
import { Badge } from 'reactstrap';
import * as Realm from 'realm';

import * as primitives from '../../../primitives';

import * as DataCell from './DataCell';

const VALUE_LENGTH_LIMIT = 10;
const VALUE_STRING_LENGTH_LIMIT = 50;

const isListOfPrimitive = (property: Realm.ObjectSchemaProperty) => {
  return primitives.isPrimitive(property.objectType || '');
};

const displayValue = (
  property: Realm.ObjectSchemaProperty,
  list: Realm.List<any>,
) => {
  if (!list) {
    return 'null';
  } else if (isListOfPrimitive(property) && list.length > 0) {
    // Let's not show all values here - 10 must be enough
    const limitedValues = list.slice(0, VALUE_LENGTH_LIMIT);
    // Concatinate ", " separated string representations of the elements in the list
    let limitedString = limitedValues
      .map((v: any) => {
        // Turn the value into a string representation
        const representation =
          property.objectType === 'data' ? DataCell.display(v) : String(v);
        // If the representation is too long, limit it
        if (representation.length > VALUE_STRING_LENGTH_LIMIT) {
          const limited = representation.substring(
            0,
            VALUE_STRING_LENGTH_LIMIT,
          );
          return `${limited} (...)`;
        } else {
          return representation;
        }
      })
      .join(', ');
    // Prepending a string if not all values are shown
    if (list.length > VALUE_LENGTH_LIMIT) {
      limitedString += ' (and more)';
    }
    return limitedString;
  } else {
    if (list.length > 0) {
      // Check if this type of object has a primary key
      const firstObject: Realm.Object = list[0];
      const primaryKey = firstObject.objectSchema().primaryKey;
      if (primaryKey) {
        let limitedString = list
          .slice(0, VALUE_LENGTH_LIMIT)
          .map(element => {
            return element[primaryKey];
          })
          .join(', ');
        if (list.length > VALUE_LENGTH_LIMIT) {
          limitedString += ' (and more)';
        }
        return `[list of ${property.objectType}: ${limitedString}]`;
      }
    }
    return `[list of ${property.objectType}]`;
  }
};

export const ListCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
}) => (
  <div className="RealmBrowser__Table__ListCell">
    <span className="RealmBrowser__Table__ListCell__Value">
      {displayValue(property, value)}
    </span>
    <span className="RealmBrowser__Table__ListCell__Count">
      <Badge color="primary">{value.length}</Badge>
    </span>
  </div>
);
