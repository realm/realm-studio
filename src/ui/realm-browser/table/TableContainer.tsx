import * as React from 'react';
import {
  AutoSizerProps,
  Grid,
  GridCellProps,
  ScrollSyncProps,
} from 'react-virtualized';

import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  ISorting,
  SortEndHandler,
} from '.';
import { IPropertyWithName } from '..';
import { IFocus } from '../focus';
import { Table } from './Table';

const MINIMUM_COLUMN_WIDTH = 20;

export interface IBaseTableContainerProps {
  focus: IFocus;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onContextMenu?: CellContextMenuHandler;
  onSortEnd?: SortEndHandler;
  query: string;
}

export interface ITableContainerProps extends IBaseTableContainerProps {
  scrollProps: ScrollSyncProps;
  sizeProps: AutoSizerProps;
}

export interface ITableContainerState {
  columnWidths: number[];
  sorting?: ISorting;
}

export class TableContainer extends React.Component<
  ITableContainerProps,
  ITableContainerState
> {
  // A reference to the grid inside the content container is needed to resize collumns
  private gridContent: Grid;
  private gridHeader: Grid;

  constructor() {
    super();
    this.state = {
      columnWidths: [],
    };
  }

  public render() {
    const filteredSortedResults = this.getFilteredSortedResults({
      query: this.props.query,
      sorting: this.state.sorting,
    });
    return filteredSortedResults ? (
      <Table
        sizeProps={this.props.sizeProps}
        scrollProps={this.props.scrollProps}
        columnWidths={this.state.columnWidths}
        filteredSortedResults={filteredSortedResults}
        focus={this.props.focus}
        getCellValue={this.getCellValue}
        gridContentRef={this.gridContentRef}
        gridHeaderRef={this.gridHeaderRef}
        highlight={this.props.highlight}
        onCellChange={this.props.onCellChange}
        onCellClick={this.props.onCellClick}
        onColumnWidthChanged={this.onColumnWidthChanged}
        onContextMenu={this.props.onContextMenu}
        onSortEnd={this.props.onSortEnd}
        onSortClick={this.onSortClick}
        sorting={this.state.sorting}
      />
    ) : null;
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
      this.setState({ sorting: undefined });
    }
  }

  public componentDidUpdate(
    prevProps: ITableContainerProps,
    prevState: ITableContainerState,
  ) {
    if (this.gridContent && this.props.highlight) {
      const rowChanged =
        !prevProps.highlight ||
        prevProps.highlight.row !== this.props.highlight.row;
      const columnChanged =
        !prevProps.highlight ||
        prevProps.highlight.column !== this.props.highlight.column;
      if (rowChanged || columnChanged) {
        this.gridContent.scrollToCell({
          columnIndex: this.props.highlight.column || 0,
          rowIndex: this.props.highlight.row || 0,
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
  }

  private getCellValue = (object: any, props: GridCellProps) => {
    const property = this.props.focus.properties[props.columnIndex];
    if (this.props.focus.kind === 'list' && property.name === '#') {
      return props.rowIndex;
    } else {
      return property.name ? object[property.name] : object;
    }
  };

  private gridContentRef = (grid: Grid) => {
    this.gridContent = grid;
  };

  private gridHeaderRef = (grid: Grid) => {
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
    this.setState({
      columnWidths,
    });
  }
}
