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

import classNames from 'classnames';
import React from 'react';
import { Input } from 'reactstrap';

interface IStringCellProps {
  getRef: (instance: HTMLInputElement) => any;
  isDisabled: boolean;
  isHighlighted: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onClick: (e: React.MouseEvent<any>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  property: Realm.ObjectSchemaProperty;
  value: string | null;
}

export const StringCell = ({
  getRef,
  isDisabled,
  onBlur,
  onChange,
  onClick,
  onFocus,
  property,
  value,
}: IStringCellProps) => {
  return (
    <Input
      className={classNames(
        'RealmBrowser__Table__StringCell',
        `RealmBrowser__Table__StringCell--${property.type}`,
        {
          'RealmBrowser__Table__StringCell--null': value === null,
        },
      )}
      bsSize="sm"
      disabled={isDisabled}
      innerRef={getRef}
      onBlur={onBlur}
      onChange={e => onChange(e.target.value)}
      onClick={onClick}
      onFocus={onFocus}
      onKeyPress={e => e.key === 'Enter' && e.currentTarget.blur()}
      value={value === null ? 'null' : value}
    />
  );
};
