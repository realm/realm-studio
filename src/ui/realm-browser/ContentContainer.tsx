import * as React from 'react';
import { Grid } from 'react-virtualized';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { Content } from './Content';
import { ClassFocus, Focus } from './focus';
import { ICellChangeOptions } from './RealmBrowserContainer';

const MINIMUM_COLUMN_WIDTH = 20;

export interface IContentContainerProps {
  focus: Focus | null;
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
    return <Content {...this.state} {...this.props} {...this} />;
  }

  public componentWillMount() {
    if (this.props.focus instanceof ClassFocus) {
      const properties = this.props.focus.getProperties();
      this.setDefaultColumnWidths(properties);
    }
  }

  public componentWillReceiveProps(props: IContentContainerProps) {
    if (props.focus instanceof ClassFocus && this.props.focus !== props.focus) {
      const properties = props.focus.getProperties();
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

  public gridContentRef = (grid: Grid) => {
    this.gridContent = grid;
  };

  public gridHeaderRef = (grid: Grid) => {
    this.gridHeader = grid;
  };

  private setDefaultColumnWidths(properties: Realm.ObjectSchemaProperty[]) {
    const columnWidths = properties.map(property => {
      switch (property.type) {
        case 'int':
          return 100;
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
