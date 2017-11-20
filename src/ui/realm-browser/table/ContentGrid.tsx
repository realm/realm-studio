import * as React from 'react';
import {
  SortableContainer,
  SortableElement,
  SortEndHandler,
  SortStartHandler,
} from 'react-sortable-hoc';
import {
  Grid,
  GridCellProps,
  GridCellRangeRenderer,
  GridCellRenderer,
  GridProps,
  Index,
} from 'react-virtualized';

import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  ISorting,
} from '.';
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
  dataVersion?: number;
  columnWidths: number[];
  filteredSortedResults: Realm.Collection<any>;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridRef: (ref: React.ReactNode) => void;
  height: number;
  highlight?: IHighlight;
  isSortable?: boolean;
  isSorting: boolean;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onContextMenu?: CellContextMenuHandler;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  properties: IPropertyWithName[];
  rowHeight: number;
  width: number;
}

export class ContentGrid extends React.PureComponent<IContentGridProps, {}> {
  private cellRangeRenderer: GridCellRangeRenderer;
  private cellRenderers: GridCellRenderer[];

  public componentWillMount() {
    this.generateRenderers(this.props);
  }

  public componentWillUpdate(nextProps: IContentGridProps) {
    if (this.props.properties !== nextProps.properties) {
      this.generateRenderers(nextProps);
    }
  }

  public render() {
    const {
      columnWidths,
      filteredSortedResults,
      gridRef,
      highlight,
      onSortEnd,
      onSortStart,
      properties,
    } = this.props;

    return (
      <SortableGrid
        {...this.props}
        lockAxis="y"
        helperClass="RealmBrowser__Table__Row--sorting-selected"
        cellRangeRenderer={this.cellRangeRenderer}
        cellRenderer={this.getCellRenderer}
        className="RealmBrowser__Table__ContentGrid"
        columnCount={properties.length}
        columnWidth={this.getColumnWidth}
        distance={5}
        onSortEnd={onSortEnd}
        onSortStart={onSortStart}
        ref={(sortableContainer: any) => {
          if (sortableContainer) {
            gridRef(sortableContainer.getWrappedInstance());
          }
        }}
        rowCount={filteredSortedResults.length}
        scrollToAlignment={highlight && highlight.center ? 'center' : 'auto'}
      />
    );
  }

  private generateRenderers(props: IContentGridProps) {
    const { properties } = props;

    const rowRenderer: GridRowRenderer = (rowProps: IGridRowProps) => {
      const { highlight, isSorting } = this.props;
      const isHighlighted =
        (highlight && highlight.row === rowProps.rowIndex) || false;
      return (
        <Row
          isHighlighted={isHighlighted}
          key={rowProps.key}
          isSorting={isSorting}
          {...rowProps}
        />
      );
    };

    const SortableRow = SortableElement<IGridRowProps>(rowRenderer);

    this.cellRangeRenderer = rowCellRangeRenderer(rowProps => {
      const { isSortable } = this.props;
      return (
        <SortableRow
          disabled={!isSortable}
          index={rowProps.rowIndex}
          key={rowProps.rowIndex}
          {...rowProps}
        />
      );
    });

    this.cellRenderers = properties.map(property => {
      return (cellProps: GridCellProps) => {
        const {
          columnWidths,
          filteredSortedResults,
          getCellValue,
          onCellChange,
          onCellClick,
          onContextMenu,
        } = this.props;
        const { rowIndex, columnIndex } = cellProps;
        const rowObject = filteredSortedResults[cellProps.rowIndex];
        const cellValue = getCellValue(rowObject, cellProps);

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
                  rowObject,
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
              if (onContextMenu) {
                onContextMenu(e, {
                  cellValue,
                  columnIndex,
                  property,
                  rowIndex,
                  rowObject,
                });
              }
            }}
          />
        );
      };
    });
  }

  private getColumnWidth = ({ index }: Index) => {
    return this.props.columnWidths[index];
  };

  private getCellRenderer = (cellProps: GridCellProps) => {
    return this.cellRenderers[cellProps.columnIndex](cellProps);
  };
}
