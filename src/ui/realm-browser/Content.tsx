import * as React from 'react';
import {
  AutoSizer,
  Grid,
  GridCellRenderer,
  ScrollSync,
} from 'react-virtualized';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import * as Realm from 'realm';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { IFocus } from './focus';
import { MoreIndicators } from './MoreIndicators';

export const Content = ({
  columnCount,
  columnWidths,
  focus,
  gridContentRef,
  gridHeaderRef,
  headerRenderers,
  onQueryChange,
  progress,
  query,
  rowCount,
  valueRenderers,
}: {
  columnWidths: number[];
  columnCount: number;
  focus: IFocus | null;
  gridContentRef: (grid: Grid) => void;
  gridHeaderRef: (grid: Grid) => void;
  headerRenderers: GridCellRenderer[];
  onQueryChange: (e: React.SyntheticEvent<any>) => void;
  progress?: ILoadingProgress;
  query: string | null;
  rowCount: number;
  valueRenderers: GridCellRenderer[];
}) => {
  if (focus) {
    const headerHeight = 40;
    const rowHeight = 26;
    const scrollBarWidth = 20;

    return (
      <div className="RealmBrowser__Content">
        <div className="RealmBrowser__Content__Actions">
          <InputGroup className="RealmBrowser__Content__Actions__Filter">
            <InputGroupAddon>
              <i className="fa fa-search" aria-hidden="true" />
            </InputGroupAddon>
            <Input
              placeholder="Query ..."
              onChange={onQueryChange}
              value={query || ''}
            />
          </InputGroup>
        </div>
        <div className="RealmBrowser__Content__AutoSizer">
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
                      <Grid
                        className="RealmBrowser__Content__HeaderGrid"
                        width={width}
                        height={headerHeight}
                        ref={gridHeaderRef}
                        rowCount={1}
                        columnCount={columnCount}
                        columnWidth={({ index }) => columnWidths[index]}
                        cellRenderer={props =>
                          headerRenderers[props.columnIndex](props)}
                        scrollLeft={scrollLeft}
                        rowHeight={headerHeight}
                        style={{
                          overflowX: 'hidden',
                        }}
                      />
                      <div
                        className="RealmBrowser__Content__ValueGridContainer"
                        style={{
                          width,
                          height: height - headerHeight,
                        }}
                      >
                        <MoreIndicators
                          scrollTop={scrollTop}
                          scrollLeft={scrollLeft}
                          scrollRight={scrollWidth - width - scrollLeft}
                          scrollBottom={
                            headerHeight + scrollHeight - height - scrollTop
                          }
                        />
                        <Grid
                          className="RealmBrowser__Content__ValueGrid"
                          width={width}
                          height={height - headerHeight}
                          ref={gridContentRef}
                          rowCount={rowCount}
                          columnCount={columnCount}
                          columnWidth={({ index }) => columnWidths[index]}
                          cellRenderer={props =>
                            valueRenderers[props.columnIndex](props)}
                          onScroll={onScroll}
                          rowHeight={rowHeight}
                        />
                      </div>
                    </div>
                  );
                }}
              </ScrollSync>
            )}
          </AutoSizer>
        </div>
      </div>
    );
  } else if (progress && progress.done) {
    return <div className="RealmBrowser__Content--no-schema-selected" />;
  } else {
    return null;
  }
};
