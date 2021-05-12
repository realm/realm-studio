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

import classNames from 'classnames';
import React from 'react';
import Realm from 'realm';
import util from 'util';
import { asSafeJsonString, useJsonViewer } from '../../../../../utils/json';

const VALUE_STRING_LENGTH_LIMIT = 50;

const displayValue = (value: any) => {
  if (value === null || typeof value === 'undefined') {
    return 'null';
  }

  if (value._bsontype) {
    return value.toString();
  }

  return util.inspect(value);
};

export const MixedCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
}) => {
  const showInJsonViewerDialog = useJsonViewer(property, value);

  const valueForRender = showInJsonViewerDialog
    ? asSafeJsonString(value, {
        cleanupRefs: true,
        maxLength: VALUE_STRING_LENGTH_LIMIT,
      })
    : displayValue(value);
  return (
    <div
      className={classNames('RealmBrowser__Table__MixedCell', {
        'RealmBrowser__Table__MixedCell--disabled': !showInJsonViewerDialog,
        'RealmBrowser__Table__MixedCell--link': showInJsonViewerDialog,
      })}
    >
      <span className="RealmBrowser__Table__MixedCell__Value">
        {valueForRender}
      </span>
    </div>
  );
};
