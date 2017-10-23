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
  getCellValue: (props: GridCellProps) => string;
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
    return <Row isHighlighted={isHighlighted} {...rowProps} />;
  });

  const cellRenderers = properties.map(property => {
    return (cellProps: GridCellProps) => {
      const { rowIndex, columnIndex } = cellProps;
      const result = filteredSortedResults[cellProps.rowIndex];
      const cellValue = getCellValue(cellProps);

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
      rowCount={filteredSortedResults.length}
    />
  );
};
