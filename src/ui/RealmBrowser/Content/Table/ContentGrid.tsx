////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import {
  Grid,
  GridCellProps,
  GridCellRangeRenderer,
  GridCellRenderer,
  GridProps,
  Index,
} from 'react-virtualized';

import { EditMode } from '..';
import { IPropertyWithName } from '../..';

import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  ReorderingEndHandler,
  ReorderingStartHandler,
  RowMouseDownHandler,
} from '.';
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
  onRowMouseDown?: RowMouseDownHandler;
  onReorderingEnd?: ReorderingEndHandler;
  onReorderingStart?: ReorderingStartHandler;
  onResetHighlight?: () => void;
  properties: IPropertyWithName[];
  rowHeight: number;
  width: number;
}

const isRowHighlighted = (
  highlight: IHighlight | undefined,
  rowIndex: number,
): boolean => {
  return highlight ? highlight.rows.has(rowIndex) : false;
};

export class ContentGrid extends React.PureComponent<IContentGridProps, {}> {
  private cellRangeRenderer?: GridCellRangeRenderer;
  private cellRenderers: GridCellRenderer[] = [];

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
      onReorderingEnd,
      onReorderingStart,
      properties,
    } = this.props;

    // Create an object of props that will be passed to the container wrapping the grid
    const containerProps = {
      // Using mouse down as the rows can prevent clicks on these
      onMouseDown: this.onContainerMouseDown,
    };

    return (
      <SortableGrid
        {...this.props}
        lockAxis="y"
        helperClass="RealmBrowser__Table__Row--sorting-selected"
        cellRangeRenderer={this.cellRangeRenderer}
        cellRenderer={this.getCellRenderer}
        className="RealmBrowser__Table__ContentGrid"
        columnWidth={this.getColumnWidth}
        columnCount={properties.length}
        containerProps={containerProps}
        distance={5}
        onSortEnd={onReorderingEnd}
        onSortStart={onReorderingStart}
        ref={(sortableContainer: any) => {
          if (sortableContainer) {
            gridRef(sortableContainer.getWrappedInstance());
          }
        }}
        rowCount={filteredSortedResults.length}
        scrollToAlignment={
          highlight && highlight.scrollTo && highlight.scrollTo.center
            ? 'center'
            : 'auto'
        }
        noContentRenderer={this.getNoContentDiv}
      />
    );
  }

  private generateRenderers(props: IContentGridProps) {
    const { properties } = props;

    const rowRenderer: GridRowRenderer = (rowProps: IGridRowProps) => {
      const { highlight, isSorting, onRowMouseDown } = this.props;

      return (
        <Row
          isHighlighted={isRowHighlighted(highlight, rowProps.rowIndex)}
          key={rowProps.key}
          isSorting={isSorting}
          onRowMouseDown={onRowMouseDown}
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
        const isCellHighlighted = highlight
          ? isRowHighlighted(highlight, rowIndex)
          : false;

        return (
          <Cell
            editMode={editMode}
            isHighlighted={isCellHighlighted}
            key={cellProps.key}
            onCellClick={e => {
              if (onCellClick) {
                onCellClick(
                  {
                    cellValue,
                    columnIndex,
                    property,
                    rowIndex,
                    rowObject,
                  },
                  e,
                );
              }
            }}
            onValidated={valid => {
              if (onCellValidated) {
                onCellValidated(rowIndex, columnIndex, valid);
              }
            }}
            onContextMenu={e => {
              e.stopPropagation();
              // Open the context menu
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
                  rowIndex,
                  columnIndex,
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
        style={{
          height: this.props.height,
          width,
        }}
      />
    );
  };

  private onContainerMouseDown: React.EventHandler<
    React.MouseEvent<HTMLElement>
  > = e => {
    const { onResetHighlight } = this.props;
    if (onResetHighlight) {
      onResetHighlight();
    }
  };
}
