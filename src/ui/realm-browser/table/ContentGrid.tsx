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
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
} from '.';
import { EditMode, IPropertyWithName } from '..';
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
  columnCount: number;
  columnWidths: number[];
  dataVersion?: number;
  editMode: EditMode;
  filteredSortedResults: Realm.Collection<any>;
  getCellValue: (object: any, props: GridCellProps) => string;
  gridRef: (grid: Grid | null) => void;
  height: number;
  highlight?: IHighlight;
  isSortable?: boolean;
  isSorting?: boolean;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCellHighlighted?: CellHighlightedHandler;
  onCellValidated?: CellValidatedHandler;
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
      filteredSortedResults,
      gridRef,
      highlight,
      onSortEnd,
      onSortStart,
    } = this.props;

    return (
      <SortableGrid
        {...this.props}
        lockAxis="y"
        helperClass="RealmBrowser__Table__Row--sorting-selected"
        cellRangeRenderer={this.cellRangeRenderer}
        cellRenderer={this.getCellRenderer}
        className="RealmBrowser__Table__ContentGrid"
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
        noContentRenderer={this.getNoContentDiv}
      />
    );
  }

  private addColumnCell = () => (cellProps: GridCellProps) => (
    <div
      key={cellProps.key}
      className="RealmBrowser__Table__Cell"
      style={cellProps.style}
    />
  );

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

    this.cellRenderers = [
      ...properties.map(property => {
        return (cellProps: GridCellProps) => {
          const {
            columnWidths,
            editMode,
            filteredSortedResults,
            getCellValue,
            highlight,
            onCellChange,
            onCellClick,
            onCellHighlighted,
            onCellValidated,
            onContextMenu,
          } = this.props;
          const { rowIndex, columnIndex } = cellProps;
          const rowObject = filteredSortedResults[cellProps.rowIndex];
          const cellValue = getCellValue(rowObject, cellProps);
          const isHighlighted = highlight
            ? highlight.row === rowIndex && highlight.column === columnIndex
            : false;

          return (
            <Cell
              editMode={editMode}
              isHighlighted={isHighlighted}
              key={cellProps.key}
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
              onValidated={valid => {
                if (onCellValidated) {
                  onCellValidated(rowIndex, columnIndex, valid);
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
              onHighlighted={() => {
                if (onCellHighlighted) {
                  onCellHighlighted({
                    row: rowIndex,
                    column: columnIndex,
                  });
                }
              }}
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
              property={property}
              style={cellProps.style}
              value={cellValue}
              width={columnWidths[cellProps.columnIndex]}
            />
          );
        };
      }),
      this.addColumnCell(),
    ];
  }

  private getColumnWidth = ({ index }: Index) => {
    return this.props.columnWidths[index];
  };

  private getCellRenderer = (cellProps: GridCellProps) => {
    return this.cellRenderers[cellProps.columnIndex](cellProps);
  };

  private getNoContentDiv = () => {
    // Accumulate the width of all columns
    const widthSum = this.props.columnWidths.reduce((sum, columnWidth) => {
      return sum + columnWidth;
    }, 0);
    // Make it as wide as the content grid or sum of column widths
    const width = Math.max(this.props.width, widthSum);
    // Render an empty div
    return (
      <div
        onContextMenu={e => {
          if (this.props.onContextMenu) {
            this.props.onContextMenu(e);
          }
        }}
        style={{
          height: this.props.height,
          width,
        }}
      />
    );
  };
}
