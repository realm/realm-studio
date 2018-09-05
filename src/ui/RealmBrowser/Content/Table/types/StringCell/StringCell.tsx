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
import { Input } from 'reactstrap';

export const StringCell = ({
  getRef,
  isEditing,
  isHighlighted,
  onBlur,
  onChange,
  onClick,
  property,
  value,
}: {
  getRef: (instance: HTMLInputElement) => any;
  isEditing: boolean;
  isHighlighted: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onClick: (e: React.MouseEvent<any>) => void;
  property: Realm.ObjectSchemaProperty;
  value: string;
}) => {
  return isEditing ? (
    <Input
      contentEditable={isEditing}
      className={classnames(
        'RealmBrowser__Table__Input',
        `RealmBrowser__Table__Input--${property.type}`,
      )}
      innerRef={getRef}
      onBlur={onBlur}
      onClick={onClick}
      onChange={e => onChange(e.target.value)}
      onKeyPress={e => e.key === 'Enter' && e.currentTarget.blur()}
      bsSize="sm"
      value={value}
    />
  ) : (
    <div
      className={classnames(
        'RealmBrowser__Table__Input',
        `RealmBrowser__Table__Input--${property.type}`,
      )}
      onDoubleClick={onClick}
    >
      <span
        className={classnames(
          'RealmBrowser__Table__StringCell',
          `RealmBrowser__Table__StringCell--${property.type}`,
          {
            'RealmBrowser__Table__StringCell--null': value === null,
          },
        )}
      >
        {value === null ? 'null' : value.toString()}
      </span>
    </div>
  );
};
