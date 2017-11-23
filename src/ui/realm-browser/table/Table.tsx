import * as React from 'react';
import {
  AutoSizer,
  AutoSizerProps,
  Grid,
  GridCellProps,
  ScrollSync,
  ScrollSyncProps,
} from 'react-virtualized';

import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  ISorting,
  SortEndHandler,
  SortStartHandler,
} from '.';
import { EditMode, IPropertyWithName } from '..';
import { IFocus } from '../focus';
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
  editMode?: EditMode;
  filteredSortedResults: Realm.Collection<any>;
  focus: IFocus;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridContentRef: (grid: Grid) => void;
  gridHeaderRef: (grid: Grid) => void;
  highlight?: IHighlight;
  isSorting: boolean;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onColumnWidthChanged: (index: number, width: number) => void;
  onContextMenu?: CellContextMenuHandler;
  onSortClick: (property: IPropertyWithName) => void;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  scrollProps: ScrollSyncProps;
  sizeProps: AutoSizerProps;
  sorting?: ISorting;
}

export const Table = ({
  dataVersion,
  columnWidths,
  editMode,
  filteredSortedResults,
  focus,
  getCellValue,
  gridContentRef,
  gridHeaderRef,
  highlight,
  isSorting,
  onCellChange,
  onCellClick,
  onColumnWidthChanged,
  onContextMenu,
  onSortClick,
  onSortEnd,
  onSortStart,
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
    <div>
      <MoreIndicator position="bottom" visible={scrollBottom > 0} />
      <MoreIndicator position="left" visible={scrollLeft > 0} />
      <MoreIndicator position="right" visible={scrollRight > 0} />
      <MoreIndicator position="top" visible={scrollTop > 0} />
      <HeaderGrid
        columnWidths={columnWidths}
        gridRef={gridHeaderRef}
        height={rowHeights.header}
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
        onCellChange={onCellChange}
        onCellClick={onCellClick}
        onContextMenu={onContextMenu}
        onScroll={onScroll}
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
        overscanRowCount={30}
        properties={focus.properties}
        rowHeight={rowHeights.content}
        width={width}
      />
    </div>
  );
};
