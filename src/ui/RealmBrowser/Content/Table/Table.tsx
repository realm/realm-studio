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
  AutoSizerProps,
  Grid,
  GridCellProps,
  ScrollSyncProps,
} from 'react-virtualized';

import { ISorting } from '..';
import { EditMode, IPropertyWithName } from '../..';
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
} from '.';
import { ContentGrid } from './ContentGrid';
import { HeaderGrid } from './HeaderGrid';
import { MoreIndicator } from './MoreIndicator';

const rowHeights = {
  header: 40,
  content: 26,
};

export interface ITableProps {
  columnWidths: number[];
  dataVersion?: number;
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
  onSortClick: (property: IPropertyWithName) => void;
  onReorderingEnd?: ReorderingEndHandler;
  onReorderingStart?: ReorderingStartHandler;
  onTableBackgroundClick: () => void;
  readOnly: boolean;
  scrollProps: ScrollSyncProps;
  sizeProps: AutoSizerProps;
  sorting?: ISorting;
}

export const Table = ({
  columnWidths,
  dataVersion,
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
  onSortClick,
  onReorderingEnd,
  onReorderingStart,
  onTableBackgroundClick,
  readOnly,
  scrollProps,
  sizeProps,
  sorting,
}: ITableProps) => {
  const {
    onScroll,
    scrollHeight,
    scrollLeft,
    scrollTop,
    scrollWidth,
  } = scrollProps;
  const { height, width } = sizeProps;
  const scrollBottom = rowHeights.header + scrollHeight - height - scrollTop;
  const scrollRight = scrollWidth - width - scrollLeft;

  return (
    <div
      onContextMenu={e => {
        if (onContextMenu) {
          onContextMenu(e);
        }
      }}
      onClick={e => {
        onTableBackgroundClick();
      }}
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
        onAddColumnEnabled={!!onAddColumnClick}
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
        onCellChange={onCellChange}
        onCellClick={onCellClick}
        onCellHighlighted={onCellHighlighted}
        onCellValidated={onCellValidated}
        onContextMenu={onContextMenu}
        onScroll={onScroll}
        onReorderingEnd={onReorderingEnd}
        onReorderingStart={onReorderingStart}
        overscanRowCount={30}
        properties={focus.properties}
        rowHeight={rowHeights.content}
        width={width}
      />
    </div>
  );
};
