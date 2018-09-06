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
import * as Realm from 'realm';

import { displayObject } from '../../../display';

// Simulate a doubleclick if the cell has focus and the user presses enter
const doubleClickIfEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === 'Enter') {
    e.currentTarget.click();
    e.currentTarget.click();
  }
};

export const ObjectCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: Realm.Object;
}) => {
  return (
    <div
      tabIndex={0}
      className={classnames('RealmBrowser__Table__ObjectCell', {
        'RealmBrowser__Table__ObjectCell--null': value === null,
      })}
      onKeyPress={doubleClickIfEnter}
    >
      {displayObject(value)}
    </div>
  );
};
