import * as React from 'react';
import { AutoSizer, Grid, GridCellProps, ScrollSync } from 'react-virtualized';

import { CellChangeHandler, CellClickHandler, IHighlight, ISorting } from '.';
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
  filteredSortedResults: Realm.Results<any>;
  focus: IFocus;
  getCellValue: (props: GridCellProps) => string;
  gridContentRef: (grid: Grid) => void;
  gridHeaderRef: (grid: Grid) => void;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onColumnWidthChanged: (index: number, width: number) => void;
  onSortClick: (property: IPropertyWithName) => void;
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
  onSortClick,
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
                <HeaderGrid
                  columnWidths={columnWidths}
                  height={rowHeights.header}
                  onColumnWidthChanged={onColumnWidthChanged}
                  onSortClick={onSortClick}
                  properties={focus.properties}
                  ref={gridHeaderRef}
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
                  <MoreIndicators
                    scrollTop={scrollTop}
                    scrollLeft={scrollLeft}
                    scrollRight={scrollWidth - width - scrollLeft}
                    scrollBottom={
                      rowHeights.header + scrollHeight - height - scrollTop
                    }
                  />
                  <ContentGrid
                    className="RealmBrowser__Table__ValueGrid"
                    columnWidths={columnWidths}
                    filteredSortedResults={filteredSortedResults}
                    getCellValue={getCellValue}
                    height={height - rowHeights.header}
                    highlight={highlight}
                    onCellChange={onCellChange}
                    onCellClick={onCellClick}
                    onScroll={onScroll}
                    properties={focus.properties}
                    ref={gridContentRef}
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
