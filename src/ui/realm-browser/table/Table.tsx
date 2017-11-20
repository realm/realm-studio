import * as React from 'react';
import { AutoSizer, Grid, GridCellProps, ScrollSync } from 'react-virtualized';

import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  ISorting,
  SortEndHandler,
} from '.';
import { IPropertyWithName } from '..';
import { IFocus } from '../focus';
import { ContentGrid } from './ContentGrid';
import { HeaderGrid } from './HeaderGrid';
import { MoreIndicators } from './MoreIndicators';

const rowHeights = {
  header: 40,
  content: 26,
};

export interface ITableProps {
  columnWidths: number[];
  filteredSortedResults: Realm.Collection<any>;
  focus: IFocus;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridContentRef: (grid: Grid) => void;
  gridHeaderRef: (grid: Grid) => void;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onContextMenu?: CellContextMenuHandler;
  onColumnWidthChanged: (index: number, width: number) => void;
  onSortClick: (property: IPropertyWithName) => void;
  onSortEnd?: SortEndHandler;
  sorting?: ISorting;
}

export const Table = ({
  columnWidths,
  filteredSortedResults,
  focus,
  getCellValue,
  gridContentRef,
  gridHeaderRef,
  highlight,
  onCellChange,
  onCellClick,
  onColumnWidthChanged,
  onContextMenu,
  onSortClick,
  onSortEnd,
  sorting,
}: ITableProps) => (
  <div className="RealmBrowser__Table">
    <AutoSizer>
      {({ width, height }) => (
        <ScrollSync>
          {({
            clientHeight,
            clientWidth,
            onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
          }) => {
            return (
              <div>
                <MoreIndicators
                  scrollTop={scrollTop}
                  scrollLeft={scrollLeft}
                  scrollRight={scrollWidth - width - scrollLeft}
                  scrollBottom={
                    rowHeights.header + scrollHeight - height - scrollTop
                  }
                />
                <HeaderGrid
                  columnWidths={columnWidths}
                  height={rowHeights.header}
                  onColumnWidthChanged={onColumnWidthChanged}
                  onSortClick={onSortClick}
                  properties={focus.properties}
                  gridRef={gridHeaderRef}
                  scrollLeft={scrollLeft}
                  sorting={sorting}
                  width={width}
                />
                <div
                  className="RealmBrowser__Table__Content"
                  style={{
                    width,
                    height: height - rowHeights.header,
                  }}
                >
                  <ContentGrid
                    className="RealmBrowser__Table__ValueGrid"
                    columnWidths={columnWidths}
                    filteredSortedResults={filteredSortedResults}
                    getCellValue={getCellValue}
                    gridRef={gridContentRef}
                    height={height - rowHeights.header}
                    highlight={highlight}
                    isSortable={focus.kind === 'list' && !sorting}
                    onCellChange={onCellChange}
                    onCellClick={onCellClick}
                    onContextMenu={onContextMenu}
                    onScroll={onScroll}
                    onSortEnd={onSortEnd}
                    overscanRowCount={50}
                    properties={focus.properties}
                    rowHeight={rowHeights.content}
                    width={width}
                  />
                </div>
              </div>
            );
          }}
        </ScrollSync>
      )}
    </AutoSizer>
  </div>
);
