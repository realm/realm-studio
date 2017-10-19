import * as React from 'react';
import { Grid, GridCellProps } from 'react-virtualized';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { Cell } from './Cell';
import { Content } from './Content';
import { IFocus } from './focus';
import { HeaderCell } from './HeaderCell';
import { ICellChangeOptions } from './RealmBrowserContainer';

const MINIMUM_COLUMN_WIDTH = 20;

export interface ISortOptions {
  propertyName: string;
  // TODO: Add a direction
}

export interface IRendererParams {
  columnWidths: number[];
  onCellChange?: (options: ICellChangeOptions) => void;
  onCellClick?: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onColumnWidthChanged: (index: number, width: number) => void;
  onContextMenu?: (
    e: React.SyntheticEvent<any>,
    object: any,
    rowIndex: number,
    property: Realm.ObjectSchemaProperty,
  ) => void;
  onSortClick: (property: string) => void;
  rowToHighlight?: number;
  sort?: ISortOptions;
  filter?: string;
}

// TODO: Remove this interface once the Realm.ObjectSchemaProperty
// has a name parameter in its type definition.
export interface IPropertyWithName extends Realm.ObjectSchemaProperty {
  name: string | null;
  readOnly: boolean;
}

export interface IContentContainerProps {
  focus: IFocus | null;
  onCellChange?: (options: ICellChangeOptions) => void;
  onCellClick?: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  progress?: ILoadingProgress;
  // TODO: Combine these into a single `highlight` property
  rowToHighlight?: number;
  columnToHighlight?: number;
  onContextMenu?: (
    e: React.SyntheticEvent<any>,
    object: any,
    rowIndex: number,
    property: Realm.ObjectSchemaProperty,
  ) => void;
}

export interface IContentContainerState {
  columnWidths: number[];
  query: string | null;
  sort: string | null;
}

export class ContentContainer extends React.Component<
  IContentContainerProps,
  IContentContainerState
> {
  // A reference to the grid inside the content container is needed to resize collumns
  private gridContent: Grid;
  private gridHeader: Grid;

  constructor() {
    super();
    this.state = {
      columnWidths: [],
      query: null,
      sort: null,
    };
  }

  public onQueryChange = (e: React.SyntheticEvent<any>) => {
    this.setState({ query: e.currentTarget.value });
  };

  public onSortClick = (property: string) => {
    const { sort } = this.state;
    this.setState({ sort: property === sort ? null : property });
  };

  public render() {
    const {
      columnCount,
      rowCount,
      headerRenderers,
      valueRenderers,
    } = this.generateRenderers();

    return (
      <Content
        {...this.state}
        {...this.props}
        {...this}
        columnCount={columnCount}
        rowCount={rowCount}
        headerRenderers={headerRenderers}
        valueRenderers={valueRenderers}
      />
    );
  }

  public componentWillMount() {
    if (this.props.focus) {
      const properties = this.props.focus.properties;
      this.setDefaultColumnWidths(properties);
    }
  }

  public componentWillReceiveProps(props: IContentContainerProps) {
    if (props.focus && this.props.focus !== props.focus) {
      const properties = props.focus.properties;
      this.setDefaultColumnWidths(properties);
      this.setState({ sort: null, query: null });
    }
  }

  public componentDidUpdate(
    prevProps: IContentContainerProps,
    prevState: IContentContainerState,
  ) {
    if (
      this.gridContent &&
      this.props.rowToHighlight &&
      (this.props.rowToHighlight !== prevProps.rowToHighlight ||
        this.props.columnToHighlight !== prevProps.columnToHighlight)
    ) {
      this.gridContent.scrollToCell({
        columnIndex: this.props.columnToHighlight || 0,
        rowIndex: this.props.rowToHighlight,
      });
    }

    if (this.state.columnWidths !== prevState.columnWidths) {
      if (this.gridContent && this.gridHeader) {
        this.gridContent.recomputeGridSize();
        this.gridHeader.recomputeGridSize();
      }
    }
  }

  public onColumnWidthChanged = (index: number, width: number) => {
    const columnWidths = Array.from(this.state.columnWidths);
    columnWidths[index] = Math.max(width, MINIMUM_COLUMN_WIDTH);
    this.setState({
      columnWidths,
    });
  };

  public generateRenderers = () => {
    const rendererParams: IRendererParams = {
      columnWidths: this.state.columnWidths,
      onCellChange: this.props.onCellChange,
      onCellClick: this.props.onCellClick,
      onColumnWidthChanged: this.onColumnWidthChanged,
      onContextMenu: this.props.onContextMenu,
      onSortClick: this.onSortClick,
      rowToHighlight: this.props.rowToHighlight,
    };

    const filteredSortedResults = this.getSortedFilteredResults({
      sort: this.state.sort ? { propertyName: this.state.sort } : undefined,
      filter: this.state.query || undefined,
    });

    const focus = this.props.focus;

    if (filteredSortedResults && focus) {
      const properties = focus.properties;
      const headerRenderers = properties.map(property => {
        return (cellProps: GridCellProps) => {
          return (
            <HeaderCell
              key={cellProps.key}
              property={property}
              propertyName={property.name}
              width={this.state.columnWidths[cellProps.columnIndex]}
              style={cellProps.style}
              onWidthChanged={newWidth =>
                this.onColumnWidthChanged(cellProps.columnIndex, newWidth)}
              onSortClick={this.onSortClick}
              sort={this.state.sort || null}
            />
          );
        };
      });

      const valueRenderers = properties.map(property => {
        return (cellProps: GridCellProps) => {
          const result = filteredSortedResults[cellProps.rowIndex];
          // The value is either the list row index or a value based on property
          const value =
            focus.kind === 'list' && property.name === '#'
              ? cellProps.rowIndex
              : this.getValue(result, property);

          return (
            <Cell
              key={cellProps.key}
              width={this.state.columnWidths[cellProps.columnIndex]}
              style={cellProps.style}
              onCellClick={() => {
                if (this.props.onCellClick) {
                  this.props.onCellClick(
                    result,
                    property,
                    value,
                    cellProps.rowIndex,
                    cellProps.columnIndex,
                  );
                }
              }}
              value={value}
              property={property}
              onUpdateValue={newValue => {
                if (this.props.onCellChange) {
                  this.props.onCellChange({
                    parent: filteredSortedResults,
                    rowIndex: cellProps.rowIndex,
                    propertyName: property.name,
                    value: newValue,
                  });
                }
              }}
              isHighlighted={this.props.rowToHighlight === cellProps.rowIndex}
              onContextMenu={e => {
                if (this.props.onContextMenu) {
                  this.props.onContextMenu(
                    e,
                    result,
                    cellProps.rowIndex,
                    property,
                  );
                }
              }}
            />
          );
        };
      });

      return {
        columnCount: properties.length,
        rowCount: filteredSortedResults.length,
        headerRenderers,
        valueRenderers,
      };
    } else {
      return {
        columnCount: 0,
        rowCount: 0,
        headerRenderers: [],
        valueRenderers: [],
      };
    }
  };

  public gridContentRef = (grid: Grid) => {
    this.gridContent = grid;
  };

  public gridHeaderRef = (grid: Grid) => {
    this.gridHeader = grid;
  };

  private getSortedFilteredResults({
    sort,
    filter,
  }: {
    sort?: ISortOptions;
    filter?: string;
  }): Realm.Results<any> | null {
    if (this.props.focus) {
      let results = this.props.focus.results;
      if (filter) {
        try {
          results = results.filtered(filter);
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.warn(`Could not filter "${filter}"`, err);
        }
      }

      if (sort) {
        try {
          results = results.sorted(sort.propertyName);
        } catch (err) {
          // tslint:disable-next-line:no-console
          console.warn(`Could not sort "${sort}"`, err);
        }
      }
      return results;
    } else {
      return null;
    }
  }

  private getValue(result: any, property: IPropertyWithName) {
    return property.name ? result[property.name] : result;
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
