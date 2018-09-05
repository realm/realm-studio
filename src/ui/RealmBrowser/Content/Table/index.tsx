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

import * as React from 'react';
import {
  SortEndHandler as ReorderingEndHandler,
  SortStartHandler as ReorderingStartHandler,
} from 'react-sortable-hoc';
import {
  Dimensions,
  Grid,
  GridCellProps,
  ScrollSyncChildProps,
} from 'react-virtualized';

import { EditMode, ISorting, SortingChangeHandler } from '..';
import { IPropertyWithName } from '../..';
import { Focus } from '../../focus';

export const rowHeights = {
  header: 50,
  content: 8 + 8 + 17,
};

export type CellChangeHandler = (
  params: {
    parent: any;
    property: IPropertyWithName;
    rowIndex: number;
    cellValue: any;
  },
) => void;

export type CellClickHandler = (
  params: {
    cellValue?: any;
    columnIndex: number;
    property?: IPropertyWithName;
    rowIndex: number;
    rowObject: any;
  },
  e?: React.MouseEvent<any>,
) => void;

export type CellContextMenuHandler = (
  e: React.MouseEvent<any>,
  params?: {
    rowObject: any;
    property: IPropertyWithName;
    cellValue: any;
    rowIndex: number;
    columnIndex: number;
  },
) => void;

export type CellHighlightedHandler = (
  cell: { rowIndex: number; columnIndex: number },
) => void;

export type CellValidatedHandler = (
  rowIndex: number,
  columnIndex: number,
  valid: boolean,
) => void;

export type DragHighlightStartHandler = (
  e: React.MouseEvent<HTMLElement>,
  rowIndex: number,
) => void;

export interface IHighlight {
  rows: Set<number>;
  scrollTo?: {
    row: number;
    column?: number;
    center?: boolean;
  };
}

export type SortClickHandler = (property: IPropertyWithName) => void;

import { Table } from './Table';

const MINIMUM_COLUMN_WIDTH = 20;

export interface IBaseTableContainerProps {
  dataVersion?: number;
  editMode: EditMode;
  filteredSortedResults: Realm.Collection<any>;
  focus: Focus;
  highlight?: IHighlight;
  onAddColumnClick?: () => void;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCellHighlighted?: CellHighlightedHandler;
  onCellValidated?: CellValidatedHandler;
  onContextMenu?: CellContextMenuHandler;
  onReorderingEnd?: ReorderingEndHandler;
  onReorderingStart?: ReorderingStartHandler;
  onResetHighlight: () => void;
  onSortingChange: SortingChangeHandler;
  onDragHighlightStart?: DragHighlightStartHandler;
  query: string;
  readOnly: boolean;
  sorting?: ISorting;
}

export interface ITableContainerProps extends IBaseTableContainerProps {
  scroll: ScrollSyncChildProps;
  dimensions: Dimensions;
}

export interface ITableContainerState {
  columnWidths: number[];
  isSorting: boolean;
}

class TableContainer extends React.PureComponent<
  ITableContainerProps,
  ITableContainerState
> {
  public state: ITableContainerState = {
    columnWidths: [],
    isSorting: false,
  };
  // A reference to the grid inside the content container is needed to resize collumns
  private gridContent: Grid | null = null;
  private gridHeader: Grid | null = null;
  // A reference to the root table div
  private tableElement: HTMLElement | null = null;

  public render() {
    return (
      <Table
        columnWidths={this.state.columnWidths}
        dataVersion={this.props.dataVersion}
        editMode={this.props.editMode}
        filteredSortedResults={this.props.filteredSortedResults}
        focus={this.props.focus}
        getCellValue={this.getCellValue}
        gridContentRef={this.gridContentRef}
        gridHeaderRef={this.gridHeaderRef}
        highlight={this.props.highlight}
        isSorting={this.state.isSorting}
        onAddColumnClick={this.props.onAddColumnClick}
        onCellChange={this.props.onCellChange}
        onCellClick={this.props.onCellClick}
        onCellHighlighted={this.props.onCellHighlighted}
        onCellValidated={this.props.onCellValidated}
        onColumnWidthChanged={this.onColumnWidthChanged}
        onContextMenu={this.props.onContextMenu}
        onDragHighlightStart={this.props.onDragHighlightStart}
        onReorderingEnd={this.onReorderingEnd}
        onReorderingStart={this.onReorderingStart}
        onResetHighlight={this.props.onResetHighlight}
        onSortClick={this.onSortClick}
        readOnly={this.props.readOnly}
        scroll={this.props.scroll}
        dimensions={this.props.dimensions}
        sorting={this.props.sorting}
        tableRef={this.tableRef}
      />
    );
  }

  public componentWillUnmount() {
    if (this.tableElement) {
      this.tableElement.removeEventListener('keydown', this.onKeyDown);
    }
  }

  public componentWillMount() {
    if (this.props.focus) {
      const properties = this.props.focus.properties;
      this.setDefaultColumnWidths(properties);
    }
  }

  public componentWillReceiveProps(props: ITableContainerProps) {
    if (props.focus && this.props.focus !== props.focus) {
      const properties = props.focus.properties;
      this.setDefaultColumnWidths(properties);
    }
  }

  public componentDidUpdate(
    prevProps: ITableContainerProps,
    prevState: ITableContainerState,
  ) {
    if (this.gridContent && this.props.highlight) {
      const rowsChanged =
        !prevProps.highlight ||
        prevProps.highlight.rows !== this.props.highlight.rows;
      if (rowsChanged && this.props.highlight.scrollTo) {
        this.gridContent.scrollToCell({
          columnIndex: this.props.highlight.scrollTo.column || 0,
          rowIndex: this.props.highlight.scrollTo.row,
        });
      }
    }

    if (this.state.columnWidths !== prevState.columnWidths) {
      if (this.gridContent && this.gridHeader) {
        this.gridContent.recomputeGridSize();
        this.gridHeader.recomputeGridSize();
      }
    }
  }

  private getCellValue = (object: any, props: GridCellProps) => {
    const property = this.props.focus.properties[props.columnIndex];
    if (this.props.focus.kind === 'list' && property.name === '#') {
      if (typeof object === 'object') {
        // Lookup the index in the list
        return this.props.focus.results.indexOf(object);
      } else {
        return props.rowIndex;
      }
    } else {
      return property.name ? object[property.name] : object;
    }
  };

  private gridContentRef = (grid: Grid | null) => {
    this.gridContent = grid;
  };

  private gridHeaderRef = (grid: Grid | null) => {
    this.gridHeader = grid;
  };

  private onColumnWidthChanged = (index: number, width: number) => {
    const columnWidths = Array.from(this.state.columnWidths);
    columnWidths[index] = Math.max(width, MINIMUM_COLUMN_WIDTH);
    this.setState({
      columnWidths,
    });
  };

  private onKeyDown = (e: KeyboardEvent) => {
    const { highlight, onCellHighlighted, focus } = this.props;
    // If a single row is highlighted
    if (highlight && highlight.rows.size === 1 && onCellHighlighted) {
      const rowIndex = highlight.rows.values().next().value;
      const columnIndex = highlight.scrollTo
        ? highlight.scrollTo.column || 0
        : 0;
      const rowCount = focus.results.length;
      const columnCount = focus.properties.length;
      // Change the highlighted cell if applicable
      if (e.key === 'ArrowUp' && rowIndex > 0) {
        onCellHighlighted({ rowIndex: rowIndex - 1, columnIndex });
      } else if (e.key === 'ArrowDown' && rowIndex < rowCount - 1) {
        onCellHighlighted({ rowIndex: rowIndex + 1, columnIndex });
      } else if (e.key === 'ArrowLeft' && columnIndex > 0) {
        onCellHighlighted({ rowIndex, columnIndex: columnIndex - 1 });
      } else if (e.key === 'ArrowRight' && columnIndex < columnCount - 1) {
        onCellHighlighted({ rowIndex, columnIndex: columnIndex + 1 });
      }
    }
  };

  private onSortClick = (property: IPropertyWithName) => {
    const { sorting } = this.props;
    if (!sorting || sorting.property.name !== property.name) {
      this.props.onSortingChange({
        property,
        reverse: false,
      });
    } else if (sorting.property.name === property.name && !sorting.reverse) {
      this.props.onSortingChange({
        property,
        reverse: true,
      });
    } else {
      this.props.onSortingChange(undefined);
    }
  };

  private onReorderingEnd: ReorderingEndHandler = (sortEvent, e) => {
    this.setState({ isSorting: false });
    if (this.props.onReorderingEnd) {
      this.props.onReorderingEnd(sortEvent, e);
    }
  };

  private onReorderingStart: ReorderingStartHandler = (sortEvent, e) => {
    this.setState({ isSorting: true });
    if (this.props.onReorderingStart) {
      this.props.onReorderingStart(sortEvent, e);
    }
  };

  private setDefaultColumnWidths(properties: IPropertyWithName[]) {
    const columnWidths = properties.map(property => {
      switch (property.type) {
        case 'int':
          return property.name === '#' ? 50 : 100;
        case 'bool':
          return 100;
        case 'string':
          return 300;
        case 'date':
          return 200;
        default:
          return 300;
      }
    });
    this.setState({ columnWidths });
  }

  private tableRef = (element: HTMLElement | null) => {
    // Add a keypress listener on the table element
    if (element) {
      element.addEventListener('keydown', this.onKeyDown);
    }
    this.tableElement = element;
  };
}

export { TableContainer as Table };
export { ReorderingEndHandler, ReorderingStartHandler };
