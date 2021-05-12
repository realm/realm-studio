////////////////////////////////////////////////////////////////////////////
//
// Copyright 2021 Realm Inc.
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

import React from 'react';
import { Badge } from 'reactstrap';
import Realm from 'realm';
import { getCellStringRepresentation } from '../../../../../utils/json';

const VALUE_LENGTH_LIMIT = 10;
const VALUE_STRING_LENGTH_LIMIT = 50;

const setTake = <T extends unknown = any>(
  set: Realm.Set<T>,
  amount: number,
): Array<T> => {
  const it = 0;
  const arr = [];
  for (const val of set) {
    if (it > amount) break;
    arr.push(val);
  }
  return arr;
};

const displayValue = (
  property: Realm.ObjectSchemaProperty,
  set: Realm.Set<any>,
) => {
  if (!set) {
    return 'null';
  } else {
    // Let's not show all values here - 10 must be enough
    const limitedValues = setTake(set, VALUE_LENGTH_LIMIT);
    // Concatenate ", " separated string representations of the elements in the set
    let limitedString = limitedValues
      .map((val: any) =>
        getCellStringRepresentation(property, val).substring(
          0,
          VALUE_STRING_LENGTH_LIMIT,
        ),
      )
      .join(', ');

    // Prepend a string if not all values are shown
    if (set.size > VALUE_LENGTH_LIMIT) {
      limitedString += ' (and more)';
    }
    return limitedString;
  }
};

export const SetCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
}) => (
  <div tabIndex={0} className="RealmBrowser__Table__SetCell">
    <span className="RealmBrowser__Table__SetCell__Value">
      {displayValue(property, value)}
    </span>
    <span className="RealmBrowser__Table__SetCell__Count">
      <Badge color="primary">{value.size}</Badge>
    </span>
  </div>
);
