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
import { asSafeJsonString } from '../../../../../utils/json';

// TODO: Get declaration from Realm
type Dictionary<T = unknown> = { [key: string]: T };

const VALUE_STRING_LENGTH_LIMIT = 50;

const displayValue = (
  property: Realm.ObjectSchemaProperty,
  dictionary: Dictionary,
) => {
  if (!dictionary) {
    return 'null';
  } else {
    return asSafeJsonString(dictionary, {
      cleanupRefs: true,
      maxLength: VALUE_STRING_LENGTH_LIMIT,
    });
  }
};

export const DictionaryCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
}) => (
  <div tabIndex={0} className="RealmBrowser__Table__DictionaryCell">
    <span className="RealmBrowser__Table__DictionaryCell__Value">
      {displayValue(property, value)}
    </span>
    <span className="RealmBrowser__Table__DictionaryCell__Count">
      <Badge color="primary">{Object.keys(value).length}</Badge>
    </span>
  </div>
);
