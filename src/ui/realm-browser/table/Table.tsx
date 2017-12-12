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
import { IPropertyWithName } from '..';
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
  filteredSortedResults: Realm.Collection<any>;
  focus: IFocus;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridContentRef: (grid: Grid) => void;
  gridHeaderRef: (grid: Grid) => void;
  hasEditingDisabled?: boolean;
  highlight?: IHighlight;
  isSorting: boolean;
  onAddColumnClick?: () => void;
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
  columnWidths,
  dataVersion,
  filteredSortedResults,
  focus,
  getCellValue,
  gridContentRef,
  gridHeaderRef,
  hasEditingDisabled,
  highlight,
  isSorting,
  onAddColumnClick,
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
  const totalColumns = focus.addColumnEnabled
    ? focus.properties.length + 1
    : focus.properties.length;

  return (
    <div>
      <MoreIndicator position="bottom" visible={scrollBottom > 0} />
      <MoreIndicator position="left" visible={scrollLeft > 0} />
      <MoreIndicator position="right" visible={scrollRight > 0} />
      <MoreIndicator position="top" visible={scrollTop > 0} />
      <HeaderGrid
        columnCount={totalColumns}
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
        columnCount={totalColumns}
        columnWidths={columnWidths}
        dataVersion={dataVersion}
        filteredSortedResults={filteredSortedResults}
        getCellValue={getCellValue}
        gridRef={gridContentRef}
        hasEditingDisabled={hasEditingDisabled}
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
