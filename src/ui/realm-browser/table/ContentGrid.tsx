import * as React from 'react';
import {
  Grid,
  GridCellProps,
  GridCellRenderer,
  GridProps,
} from 'react-virtualized';

import { CellChangeHandler, CellClickHandler, IHighlight, ISorting } from '.';
import { IPropertyWithName } from '..';
import { Cell } from './Cell';
import { Row } from './Row';
import { rowCellRangeRenderer } from './rowCellRangeRenderer';

export interface IContentGridProps extends Partial<GridProps> {
  columnWidths: number[];
  filteredSortedResults: Realm.Results<any>;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridRef: (ref: React.ReactNode) => void;
  height: number;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  properties: IPropertyWithName[];
  rowHeight: number;
  width: number;
}

export const ContentGrid = (props: IContentGridProps) => {
  const {
    columnWidths,
    filteredSortedResults,
    getCellValue,
    gridRef,
    height,
    highlight,
    onCellChange,
    onCellClick,
    properties,
    rowHeight,
    width,
  } = props;

  const cellRangeRenderer = rowCellRangeRenderer(rowProps => {
    const isHighlighted =
      (highlight && highlight.row === rowProps.rowIndex) || false;
    return (
      <Row isHighlighted={isHighlighted} key={rowProps.key} {...rowProps} />
    );
  });

  const cellRenderers = properties.map(property => {
    return (cellProps: GridCellProps) => {
      const { rowIndex, columnIndex } = cellProps;
      const result = filteredSortedResults[cellProps.rowIndex];
      const cellValue = getCellValue(result, cellProps);

      return (
        <Cell
          key={cellProps.key}
          width={columnWidths[cellProps.columnIndex]}
          style={cellProps.style}
          onCellClick={() => {
            if (onCellClick) {
              onCellClick({
                cellValue,
                columnIndex,
                property,
                rowIndex,
                rowObject: result,
              });
            }
          }}
          value={cellValue}
          property={property}
          onUpdateValue={value => {
            if (onCellChange) {
              onCellChange({
                cellValue: value,
                parent: filteredSortedResults,
                property,
                rowIndex,
              });
            }
          }}
          onContextMenu={e => {
            // TODO: Fix this
            /*
            if (onContextMenu) {
              onContextMenu(
                e,
                result,
                cellProps.rowIndex,
                property,
              );
            }
            */
          }}
        />
      );
    };
  });

  return (
    <Grid
      {...props}
      cellRangeRenderer={cellRangeRenderer}
      cellRenderer={cellProps =>
        cellRenderers[cellProps.columnIndex](cellProps)}
      className="RealmBrowser__Table__ContentGrid"
      columnCount={properties.length}
      columnWidth={({ index }) => columnWidths[index]}
      ref={gridRef}
      rowCount={filteredSortedResults.length}
    />
  );
};
