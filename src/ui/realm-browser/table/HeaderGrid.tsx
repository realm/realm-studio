import * as React from 'react';
import {
  Grid,
  GridCellProps,
  GridCellRenderer,
  GridProps,
} from 'react-virtualized';

import { ISorting } from '.';
import { IPropertyWithName } from '..';
import { HeaderCell } from './HeaderCell';

export interface IHeaderGridProps extends Partial<GridProps> {
  columnWidths: number[];
  gridRef: (ref: React.ReactNode) => void;
  height: number;
  onColumnWidthChanged: (index: number, width: number) => void;
  onSortClick: (property: IPropertyWithName) => void;
  properties: IPropertyWithName[];
  sorting?: ISorting;
  width: number;
}

export const HeaderGrid = (props: IHeaderGridProps) => {
  const {
    columnWidths,
    gridRef,
    height,
    onColumnWidthChanged,
    onSortClick,
    properties,
    scrollLeft,
    sorting,
    width,
  } = props;

  const cellRenderers = properties.map(property => {
    return (cellProps: GridCellProps) => {
      return (
        <HeaderCell
          key={cellProps.key}
          property={property}
          width={columnWidths[cellProps.columnIndex]}
          style={cellProps.style}
          onSortClick={() => onSortClick(property)}
          onWidthChanged={newWidth =>
            onColumnWidthChanged(cellProps.columnIndex, newWidth)}
          sorting={sorting}
        />
      );
    };
  });

  return (
    <Grid
      {...props}
      className="RealmBrowser__Table__HeaderGrid"
      rowCount={1}
      columnCount={properties.length}
      columnWidth={({ index }) => columnWidths[index]}
      cellRenderer={cellProps =>
        cellRenderers[cellProps.columnIndex](cellProps)}
      ref={gridRef}
      rowHeight={height}
      style={{
        // TODO: Consider if this could be moved to the CSS
        overflowX: 'hidden',
      }}
    />
  );
};
