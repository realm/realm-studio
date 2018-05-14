import * as React from 'react';
import { SortEndHandler, SortStartHandler } from 'react-sortable-hoc';
import {
  AutoSizerProps,
  Grid,
  GridCellProps,
  ScrollSyncProps,
} from 'react-virtualized';

import { EditMode, IPropertyWithName } from '..';
import { Focus } from '../focus';

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
    rowObject: any;
    property: IPropertyWithName;
    cellValue: any;
    rowIndex: number;
    columnIndex: number;
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

export interface IHighlight {
  rows: Set<number>;
  column?: number;
  center?: boolean;
  lastRowIndexClicked?: number;
}

export interface ISorting {
  property: IPropertyWithName;
  reverse: boolean;
}

export type SortClickHandler = (property: IPropertyWithName) => void;

import { Table } from './Table';

const MINIMUM_COLUMN_WIDTH = 20;

export interface IBaseTableContainerProps {
  dataVersion?: number;
  editMode: EditMode;
  focus: Focus;
  highlight?: IHighlight;
  onAddColumnClick?: () => void;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCellHighlighted?: CellHighlightedHandler;
  onCellValidated?: CellValidatedHandler;
  onContextMenu?: CellContextMenuHandler;
  onResetHighlight: () => void;
  onTableBackgroundClick: () => void;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  query: string;
}

export interface ITableContainerProps extends IBaseTableContainerProps {
  scrollProps: ScrollSyncProps;
  sizeProps: AutoSizerProps;
}

export interface ITableContainerState {
  columnWidths: number[];
  isSorting: boolean;
  sorting?: ISorting;
}

class TableContainer extends React.PureComponent<
  ITableContainerProps,
  ITableContainerState
> {
  // A reference to the grid inside the content container is needed to resize collumns
  private gridContent: Grid | null = null;
  private gridHeader: Grid | null = null;

  constructor() {
    super();
    this.state = {
      columnWidths: [],
      isSorting: false,
    };
  }

  public render() {
    const filteredSortedResults = this.getFilteredSortedResults({
      query: this.props.query,
      sorting: this.state.sorting,
    });
    return filteredSortedResults ? (
      <Table
        columnWidths={this.state.columnWidths}
        dataVersion={this.props.dataVersion}
        editMode={this.props.editMode}
        filteredSortedResults={filteredSortedResults}
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
        onSortClick={this.onSortClick}
        onSortEnd={this.onSortEnd}
        onSortStart={this.onSortStart}
        onTableBackgroundClick={this.props.onTableBackgroundClick}
        scrollProps={this.props.scrollProps}
        sizeProps={this.props.sizeProps}
        sorting={this.state.sorting}
      />
    ) : null;
  }

  public componentWillMount() {
    if (this.props.focus) {
      const properties = this.props.focus.properties;
      this.setDefaultColumnWidths(
        properties,
        this.props.focus.addColumnEnabled,
      );
    }
  }

  public componentWillReceiveProps(props: ITableContainerProps) {
    if (props.focus && this.props.focus !== props.focus) {
      const properties = props.focus.properties;
      this.setDefaultColumnWidths(
        properties,
        this.props.focus.addColumnEnabled,
      );
      this.setState({ sorting: undefined });
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
      const columnChanged =
        !prevProps.highlight ||
        prevProps.highlight.column !== this.props.highlight.column;
      if (rowsChanged || columnChanged) {
        this.gridContent.scrollToCell({
          columnIndex: this.props.highlight.column || 0,
          rowIndex: this.props.highlight.lastRowIndexClicked || 0,
        });
      }
    } else if (this.gridContent && this.props.focus !== prevProps.focus) {
      // When the focus change - we reset the grid scrolling
      // if no highlight was explicitly sat
      this.gridContent.scrollToCell({
        columnIndex: 0,
        rowIndex: 0,
      });
    }

    if (this.state.columnWidths !== prevState.columnWidths) {
      if (this.gridContent && this.gridHeader) {
        this.gridContent.recomputeGridSize();
        this.gridHeader.recomputeGridSize();
      }
    }

    if (this.state.sorting !== prevState.sorting) {
      this.props.onResetHighlight();
    }
  }

  private getCellValue = (object: any, props: GridCellProps) => {
    const property = this.props.focus.properties[props.columnIndex];
    if (this.props.focus.kind === 'list' && property.name === '#') {
      return props.rowIndex;
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

  private onSortClick = (property: IPropertyWithName) => {
    const { sorting } = this.state;
    if (!sorting || sorting.property.name !== property.name) {
      this.setState({
        sorting: {
          property,
          reverse: false,
        },
      });
    } else if (sorting.property.name === property.name && !sorting.reverse) {
      this.setState({
        sorting: {
          property,
          reverse: true,
        },
      });
    } else {
      this.setState({ sorting: undefined });
    }
  };

  private onSortEnd: SortEndHandler = (sortEvent, e) => {
    this.setState({ isSorting: false });
    if (this.props.onSortEnd) {
      this.props.onSortEnd(sortEvent, e);
    }
  };

  private onSortStart: SortStartHandler = (sortEvent, e) => {
    this.setState({ isSorting: true });
    if (this.props.onSortStart) {
      this.props.onSortStart(sortEvent, e);
    }
  };

  private getFilteredSortedResults({
    query,
    sorting,
  }: {
    query?: string;
    sorting?: ISorting;
  }): Realm.Collection<any> | null {
    if (this.props.focus) {
      let results = this.props.focus.results;
      if (query) {
        try {
          results = results.filtered(query);
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.warn(`Could not filter on "${query}"`, err);
        }
      }

      if (sorting) {
        const propertyName = sorting.property.name;
        if (propertyName) {
          results = results.sorted(propertyName, sorting.reverse);
        }
      }
      return results;
    } else {
      return null;
    }
  }

  private setDefaultColumnWidths(
    properties: IPropertyWithName[],
    addColumnEnabled?: boolean,
  ) {
    const columnWidths = [
      ...properties.map(property => {
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
      }),
      addColumnEnabled ? 50 : 0,
    ];
    this.setState({
      columnWidths,
    });
  }
}

export { TableContainer as Table };
export { SortEndHandler, SortStartHandler };
