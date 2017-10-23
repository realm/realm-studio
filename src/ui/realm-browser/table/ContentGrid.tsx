import * as React from 'react';
import {
  SortableContainer,
  SortableElement,
  SortEndHandler,
} from 'react-sortable-hoc';
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
import {
  GridRowRenderer,
  IGridRowProps,
  rowCellRangeRenderer,
} from './rowCellRangeRenderer';

// Must pass Grid as any - due to a bug in the types
const SortableGrid = SortableContainer<GridProps>(Grid as any, {
  withRef: true,
});

export interface IContentGridProps extends Partial<GridProps> {
  columnWidths: number[];
  filteredSortedResults: Realm.Collection<any>;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridRef: (ref: React.ReactNode) => void;
  height: number;
  highlight?: IHighlight;
  isSortable?: boolean;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onSortEnd?: SortEndHandler;
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
    isSortable,
    onCellChange,
    onCellClick,
    onSortEnd,
    properties,
    rowHeight,
    width,
  } = props;

  const rowRenderer: GridRowRenderer = (rowProps: IGridRowProps) => {
    const isHighlighted =
      (highlight && highlight.row === rowProps.rowIndex) || false;
    return (
      <Row isHighlighted={isHighlighted} key={rowProps.key} {...rowProps} />
    );
  };

  const SortableRow = SortableElement<IGridRowProps>(rowRenderer);

  const cellRangeRenderer = rowCellRangeRenderer(rowProps => {
    return (
      <SortableRow
        disabled={!isSortable}
        index={rowProps.rowIndex}
        key={rowProps.rowIndex}
        {...rowProps}
      />
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
          onCellClick={e => {
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
    <SortableGrid
      {...props}
      lockAxis="y"
      helperClass="RealmBrowser__Table__Row--sorting"
      cellRangeRenderer={cellRangeRenderer}
      cellRenderer={cellProps =>
        cellRenderers[cellProps.columnIndex](cellProps)}
      className="RealmBrowser__Table__ContentGrid"
      columnCount={properties.length}
      columnWidth={({ index }) => columnWidths[index]}
      distance={5}
      onSortEnd={onSortEnd}
      ref={(sortableContainer: any) => {
        if (sortableContainer) {
          gridRef(sortableContainer.getWrappedInstance());
        }
      }}
      rowCount={filteredSortedResults.length}
    />
  );
};
