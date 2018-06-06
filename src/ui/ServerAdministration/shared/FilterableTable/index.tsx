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
import {
  AutoSizer,
  Dimensions as IAutoSizerDimensions,
  Table,
} from 'react-virtualized';
import { QuerySearch } from '../../../reusable/QuerySearch';
import './FilterableTable.scss';

export const FilterableTableWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="Table">{children}</div>;

export interface IProps {
  children: JSX.Element[];
  elementIdProperty: string;
  elements: Realm.Results<any>;
  onElementDoubleClick?: (elementIdSelected: string) => void;
  onElementSelected: (elementIdSelected: string | null) => void;
  onSearchStringChange: (searchString: string) => void;
  searchPlaceholder: string;
  searchString: string;
  selectedIdPropertyValue: string | null;
}

export const FilterableTable = ({
  children,
  elementIdProperty,
  elements,
  onElementDoubleClick,
  onElementSelected,
  onSearchStringChange,
  searchPlaceholder,
  searchString,
  selectedIdPropertyValue,
}: IProps) => (
  <div className="Table__content">
    <div className="Table__topbar">
      <QuerySearch
        query={searchString}
        onQueryChange={onSearchStringChange}
        placeholder={searchPlaceholder}
      />
    </div>
    <div className="Table__table" onClick={() => onElementSelected(null)}>
      <AutoSizer>
        {({ width, height }: IAutoSizerDimensions) => (
          <Table
            width={width}
            height={height}
            rowHeight={30}
            headerHeight={30}
            rowClassName={({ index }) => {
              const element = elements[index];
              return classnames('Table__row', {
                'Table__row--selected':
                  element &&
                  element[elementIdProperty] === selectedIdPropertyValue,
              });
            }}
            rowCount={elements.length}
            rowGetter={({ index }) => elements[index]}
            onRowClick={({ event, index }) => {
              const element = elements[index];
              onElementSelected(
                element &&
                element[elementIdProperty] !== selectedIdPropertyValue
                  ? element[elementIdProperty]
                  : null,
              );
              event.stopPropagation();
            }}
            onRowDoubleClick={({ event, index }) => {
              const element = elements[index];
              if (onElementDoubleClick) {
                onElementDoubleClick(element[elementIdProperty]);
              }
            }}
          >
            {children}
          </Table>
        )}
      </AutoSizer>
    </div>
  </div>
);
