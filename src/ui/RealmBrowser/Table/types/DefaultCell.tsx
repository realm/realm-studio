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
import * as util from 'util';

export const DefaultCell = ({
  property,
  value,
}: {
  property: Realm.ObjectSchemaProperty;
  value: any;
}) => (
  <div
    className={classnames(
      'form-control',
      'form-control-sm',
      'RealmBrowser__Table__Input',
      'RealmBrowser__Table__Input--disabled',
    )}
  >
    {util.inspect(value)}
  </div>
);
