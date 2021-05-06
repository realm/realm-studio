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

import { EditMode } from '..';
import { IPropertyWithName } from '../..';

import {
  DataCell,
  DefaultCell,
  DictionaryCell,
  ListCell,
  ListIndexCell,
  ObjectCell,
  SetCell,
  StringCell,
} from './types';

const getCellContent = ({
  editMode,
  isHighlighted,
  isScrolling,
  onHighlighted,
  onUpdateValue,
  onValidated,
  property,
  value,
}: {
  editMode: EditMode;
  isHighlighted?: boolean;
  isScrolling?: boolean;
  onHighlighted: () => void;
  onUpdateValue: (value: string) => void;
  onValidated: (valid: boolean) => void;
  property: IPropertyWithName;
  value: any;
}) => {
  // A special cell for the list index
  if (property.name === '#' && property.type === 'int' && property.readOnly) {
    return <ListIndexCell value={value} />;
  }

  // Alternatively - based on type
  switch (property.type) {
    case 'objectId':
    case 'uuid':
    case 'int':
    case 'float':
    case 'double':
    case 'decimal128':
    case 'bool':
    case 'string':
    case 'date': {
      return (
        <StringCell
          editMode={editMode}
          isHighlighted={isHighlighted}
          onHighlighted={onHighlighted}
          onUpdateValue={onUpdateValue}
          onValidated={onValidated}
          property={property}
          value={value}
          valueToString={
            property.type === 'date'
              ? v => (v ? v.toISOString() : v)
              : undefined
          }
        />
      );
    }
    case 'data':
      return (
        <DataCell isEditable={editMode !== EditMode.Disabled} value={value} />
      );
    case 'list':
      return <ListCell property={property} value={value} />;
    case 'dictionary':
      return <DictionaryCell property={property} value={value} />;
    case 'set':
      return <SetCell property={property} value={value} />;
    case 'object':
      return <ObjectCell property={property} value={value} />;
    default:
      return <DefaultCell property={property} value={value} />;
  }
};

export const Cell = ({
  editMode,
  isHighlighted,
  isScrolling,
  onCellClick,
  onContextMenu,
  onHighlighted,
  onUpdateValue,
  onValidated,
  property,
  style,
  value,
}: {
  editMode: EditMode;
  isHighlighted?: boolean;
  isScrolling?: boolean;
  onCellClick: (e: React.MouseEvent<any>) => void;
  onContextMenu: (e: React.MouseEvent<any>) => void;
  onHighlighted: () => void;
  onUpdateValue: (value: string) => void;
  onValidated: (valid: boolean) => void;
  property: IPropertyWithName;
  style: React.CSSProperties;
  value: any;
}) => {
  const content = getCellContent({
    editMode,
    isHighlighted,
    isScrolling,
    onValidated,
    onHighlighted,
    onUpdateValue,
    property,
    value,
  });
  return (
    <div
      className={classNames('RealmBrowser__Table__Cell', {
        'RealmBrowser__Table__Cell--highlighted': isHighlighted,
      })}
      onClick={onCellClick}
      onContextMenu={onContextMenu}
      onFocus={() => {
        // When the cell gets focussed (could happen by clicking or tabbing)
        // - ensure it also gets highlighted
        if (!isHighlighted) {
          onHighlighted();
        }
      }}
      style={style}
    >
      {content}
    </div>
  );
};
