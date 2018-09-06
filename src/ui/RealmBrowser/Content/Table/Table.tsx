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

import * as React from 'react';
import {
  Dimensions,
  Grid,
  GridCellProps,
  ScrollSyncChildProps,
} from 'react-virtualized';

import { EditMode, ISorting } from '..';
import { IPropertyWithName } from '../..';
import { Focus } from '../../focus';

import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  ReorderingEndHandler,
  ReorderingStartHandler,
  rowHeights,
  RowMouseDownHandler,
} from '.';
import { ContentGrid } from './ContentGrid';
import { HeaderGrid } from './HeaderGrid';
import { MoreIndicator } from './MoreIndicator';

export interface ITableProps {
  columnWidths: number[];
  dataVersion?: number;
  dimensions: Dimensions;
  editMode: EditMode;
  filteredSortedResults: Realm.Collection<any>;
  focus: Focus;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridContentRef: (grid: Grid | null) => void;
  gridHeaderRef: (grid: Grid | null) => void;
  highlight?: IHighlight;
  isSorting: boolean;
  onAddColumnClick?: () => void;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCellHighlighted?: CellHighlightedHandler;
  onCellValidated?: CellValidatedHandler;
  onColumnWidthChanged: (index: number, width: number) => void;
  onContextMenu?: CellContextMenuHandler;
  onRowMouseDown?: RowMouseDownHandler;
  onReorderingEnd?: ReorderingEndHandler;
  onReorderingStart?: ReorderingStartHandler;
  onResetHighlight: () => void;
  onSortClick: (property: IPropertyWithName) => void;
  readOnly: boolean;
  scroll: ScrollSyncChildProps;
  sorting?: ISorting;
  tableRef: (element: HTMLElement | null) => void;
}

export const Table = ({
  columnWidths,
  dataVersion,
  dimensions,
  editMode,
  filteredSortedResults,
  focus,
  getCellValue,
  gridContentRef,
  gridHeaderRef,
  highlight,
  isSorting,
  onAddColumnClick,
  onCellChange,
  onCellClick,
  onCellHighlighted,
  onCellValidated,
  onColumnWidthChanged,
  onContextMenu,
  onRowMouseDown,
  onReorderingEnd,
  onReorderingStart,
  onResetHighlight,
  onSortClick,
  readOnly,
  scroll,
  sorting,
  tableRef,
}: ITableProps) => {
  const { onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth } = scroll;
  const { height, width } = dimensions;
  const scrollBottom = rowHeights.header + scrollHeight - height - scrollTop;
  const scrollRight = scrollWidth - width - scrollLeft;

  return (
    <div
      onContextMenu={e => {
        if (onContextMenu) {
          onContextMenu(e);
        }
      }}
      ref={tableRef}
    >
      <MoreIndicator position="bottom" visible={scrollBottom > 0} />
      <MoreIndicator position="left" visible={scrollLeft > 0} />
      <MoreIndicator position="right" visible={scrollRight > 0} />
      <MoreIndicator position="top" visible={scrollTop > 0} />
      <HeaderGrid
        columnWidths={columnWidths}
        gridRef={gridHeaderRef}
        height={rowHeights.header}
        onAddColumnClick={onAddColumnClick}
        onColumnWidthChanged={onColumnWidthChanged}
        onSortClick={onSortClick}
        overscanColumnCount={2}
        properties={focus.properties}
        scrollLeft={scrollLeft}
        sorting={sorting}
        width={width}
      />
      <ContentGrid
        className="RealmBrowser__Table__ValueGrid"
        columnWidths={columnWidths}
        dataVersion={dataVersion}
        editMode={editMode}
        filteredSortedResults={filteredSortedResults}
        getCellValue={getCellValue}
        gridRef={gridContentRef}
        height={height - rowHeights.header}
        highlight={highlight}
        isSortable={focus.kind === 'list' && !sorting}
        isSorting={isSorting}
        onAddColumnEnabled={!!onAddColumnClick}
        onCellChange={onCellChange}
        onCellClick={onCellClick}
        onCellHighlighted={onCellHighlighted}
        onCellValidated={onCellValidated}
        onContextMenu={onContextMenu}
        onRowMouseDown={onRowMouseDown}
        onReorderingEnd={onReorderingEnd}
        onReorderingStart={onReorderingStart}
        onResetHighlight={onResetHighlight}
        onScroll={onScroll}
        overscanRowCount={30}
        properties={focus.properties}
        rowHeight={rowHeights.content}
        width={width}
      />
    </div>
  );
};
