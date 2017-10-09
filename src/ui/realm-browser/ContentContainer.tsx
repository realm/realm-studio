import * as React from 'react';
import { Grid } from 'react-virtualized';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { Content } from './Content';

const MINIMUM_COLUMN_WIDTH = 20;

export interface IContentContainerProps {
  onCellChange?: (object: any, propertyName: string, value: string) => void;
  onCellClick?: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  schema: Realm.ObjectSchema | null;
  progress: ILoadingProgress;
  rowToHighlight?: number;
  columnToHighlight?: number;
  data: Realm.Results<any> | any;
  onContextMenu?: (
    e: React.SyntheticEvent<any>,
    object: any,
    property: Realm.ObjectSchemaProperty,
  ) => void;
}

export class ContentContainer extends React.Component<
  IContentContainerProps,
  {
    columnWidths: number[];
    query: string | null;
    sort: string | null;
  }
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

  get filteredData(): any {
    const { data } = this.props;
    const { query, sort } = this.state;

    let newData = data;

    if (query) {
      try {
        newData = data.filtered(query);
      } catch (err) {
        newData = data;
      }
    }

    if (sort) {
      try {
        newData = newData.sorted(sort);
      } catch (err) {
        return newData;
      }
    }

    return newData;
  }

  public onQueryChange = (e: React.SyntheticEvent<any>) => {
    this.setState({ query: e.currentTarget.value });
  };

  public onSortClick = (property: string) => {
    const { sort } = this.state;
    this.setState({ sort: property === sort ? null : property });
  };

  public render() {
    return (
      <Content
        {...this.state}
        {...this.props}
        {...this}
        data={this.filteredData}
      />
    );
  }

  public componentWillMount() {
    if (this.props.schema) {
      this.setDefaultColumnWidths(this.props.schema);
    }
  }

  public componentWillReceiveProps(props: IContentContainerProps) {
    if (props.schema && this.props.schema !== props.schema) {
      this.setDefaultColumnWidths(props.schema);
      this.setState({ sort: null, query: null });
    }
  }

  public componentDidUpdate(prevProps: IContentContainerProps) {
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
  }

  public onColumnWidthChanged = (index: number, width: number) => {
    const columnWidths = Array.from(this.state.columnWidths);
    columnWidths[index] = Math.max(width, MINIMUM_COLUMN_WIDTH);
    this.setState({
      columnWidths,
    });
    if (this.gridContent && this.gridHeader) {
      this.gridContent.recomputeGridSize();
      this.gridHeader.recomputeGridSize();
    }
  };

  public gridContentRef = (grid: Grid) => {
    this.gridContent = grid;
  };

  public gridHeaderRef = (grid: Grid) => {
    this.gridHeader = grid;
  };

  private setDefaultColumnWidths(schema: Realm.ObjectSchema) {
    const columnWidths = Object.keys(schema.properties).map(propertyName => {
      const property = schema.properties[
        propertyName
      ] as Realm.ObjectSchemaProperty;
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
          return 200;
      }
    });
    this.setState({
      columnWidths,
    });
    if (this.gridContent && this.gridHeader) {
      this.gridContent.recomputeGridSize();
      this.gridHeader.recomputeGridSize();
    }
  }
}
