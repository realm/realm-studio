import * as React from 'react';
import {
  AutoSizer,
  Dimensions as IAutoSizerDimensions,
  Grid,
  ScrollSync,
} from 'react-virtualized';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import * as Realm from 'realm';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { Cell } from './Cell';
import { Focus, IRendererParams } from './focus';
import { HeaderCell } from './HeaderCell';
import { MoreIndicators } from './MoreIndicators';
import { ICellChangeOptions } from './RealmBrowserContainer';

export const Content = ({
  columnWidths,
  focus,
  gridContentRef,
  gridHeaderRef,
  onCellChange,
  onCellClick,
  onColumnWidthChanged,
  onContextMenu,
  onQueryChange,
  onSortClick,
  progress,
  query,
  rowToHighlight,
  sort,
}: {
  columnWidths: number[];
  focus: Focus | null;
  gridContentRef: (grid: Grid) => void;
  gridHeaderRef: (grid: Grid) => void;
  onCellChange?: (options: ICellChangeOptions) => void;
  onCellClick?: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onColumnWidthChanged: (index: number, width: number) => void;
  onContextMenu?: (
    e: React.SyntheticEvent<any>,
    object: any,
    rowIndex: number,
    property: Realm.ObjectSchemaProperty,
  ) => void;
  onQueryChange: (e: React.SyntheticEvent<any>) => void;
  onSortClick: (property: string) => void;
  progress?: ILoadingProgress;
  query: string | null;
  rowToHighlight?: number;
  sort: string | null;
}) => {
  if (focus) {
    const headerHeight = 40;
    const rowHeight = 26;
    const scrollBarWidth = 20;

    const rendererParams: IRendererParams = {
      columnWidths,
      onCellChange,
      onCellClick,
      onColumnWidthChanged,
      onContextMenu,
      onSortClick,
      rowToHighlight,
      filter: query ? query : undefined,
      sort: sort ? { propertyName: sort } : undefined,
    };

    const {
      columnCount,
      rowCount,
      headerRenderers,
      valueRenderers,
    } = focus.generateRenderers(rendererParams);

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
