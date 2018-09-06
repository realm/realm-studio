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

import { RowMouseDownHandler } from '.';
import { IGridRowProps } from './rowCellRangeRenderer';

export interface IRowProps extends IGridRowProps {
  isHighlighted?: boolean;
  isSorting?: boolean;
  onRowMouseDown?: RowMouseDownHandler;
}

export const Row = ({
  children,
  isHighlighted,
  isSorting,
  rowIndex,
  style,
  onRowMouseDown,
}: IRowProps) => {
  return (
    <div
      className={classnames('RealmBrowser__Table__Row', {
        'RealmBrowser__Table__Row--highlighted': isHighlighted,
        'RealmBrowser__Table__Row--striped': rowIndex % 2 === 1 && !isSorting,
        'RealmBrowser__Table__Row--sorting': isSorting,
      })}
      style={style}
      onMouseDown={
        onRowMouseDown ? e => onRowMouseDown(e, rowIndex) : undefined
      }
    >
      {children}
    </div>
  );
};
