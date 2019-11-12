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
import {
  AutoSizer,
  ColumnProps,
  Dimensions as IAutoSizerDimensions,
  Table,
} from 'react-virtualized';
import { QuerySearch } from '../../../reusable/QuerySearch';
import './FilterableTable.scss';

export interface IFilterableTableProps<E extends any> {
  className?: string;
  children: Array<React.ReactElement<ColumnProps>>;
  elements: Realm.Results<E>;
  isElementsEqual: (a: E, b: E) => boolean;
  onElementClick: (e: React.MouseEvent<HTMLElement>, element: E) => void;
  onElementDoubleClick?: (element: E) => void;
  onElementsDeselection: () => void;
  onSearchStringChange: (searchString: string) => void;
  searchPlaceholder: string;
  searchString: string;
  queryError?: Error;
  selectedElements: E[];
  onQueryHelp?: () => void;
  queryHelpTooltip?: JSX.Element;
}

export const FilterableTable = <E extends any>({
  className,
  children,
  elements,
  isElementsEqual,
  onElementClick,
  onElementDoubleClick,
  onElementsDeselection,
  onSearchStringChange,
  searchPlaceholder,
  searchString,
  selectedElements,
  queryError,
  onQueryHelp,
  queryHelpTooltip,
}: IFilterableTableProps<E>) => (
  <div className={classNames('Table', className)}>
    <div className="Table__Topbar">
      <QuerySearch
        query={searchString}
        onQueryChange={onSearchStringChange}
        onQueryHelp={onQueryHelp}
        queryHelpTooltip={queryHelpTooltip}
        queryError={queryError}
        placeholder={searchPlaceholder}
      />
    </div>
    <div className="Table__Table" onClick={() => onElementsDeselection()}>
      <AutoSizer>
        {({ width, height }: IAutoSizerDimensions) => (
          <Table
            width={width}
            height={height}
            rowHeight={30}
            headerHeight={30}
            rowClassName={({ index }) => {
              if (index >= 0) {
                const element = elements[index];
                // When https://github.com/realm/realm-js/issues/19 we could use a `Set`
                const isSelected = !!selectedElements.find(e =>
                  isElementsEqual(e, element),
                );
                return classNames('Table__Row', {
                  'Table__Row--selected': isSelected,
                });
              } else {
                return 'Table__Row';
              }
            }}
            rowCount={elements.length}
            rowGetter={({ index }) => elements[index]}
            onRowClick={({ event, index }) => {
              const element = elements[index];
              // TODO: Remove the cast once https://github.com/DefinitelyTyped/DefinitelyTyped/pull/28169 gets merged.
              onElementClick(event as React.MouseEvent<any>, element);
              event.preventDefault();
              event.stopPropagation();
            }}
            onRowDoubleClick={({ event, index }) => {
              const element = elements[index];
              if (onElementDoubleClick) {
                onElementDoubleClick(element);
              }
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            {children}
          </Table>
        )}
      </AutoSizer>
    </div>
  </div>
);
