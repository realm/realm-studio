import * as React from "react";
import {Grid} from "react-virtualized";

import {Content} from "./Content";

const MINIMUM_COLUMN_WIDTH = 20;

export interface IContentContainerProps {
  getObject: (index: number) => any;
  numberOfObjects: number;
  onCellChange: (object: any, propertyName: string, value: string) => void;
  onListCellClick: (object: any, property: Realm.ObjectSchemaProperty, value: any) => void;
  schema: Realm.ObjectSchema | null;
  rowToHighlight: number | null;
}

export class ContentContainer extends React.Component<IContentContainerProps, {
  columnWidths: number[],
}> {

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
    return <Content {...this.state} {...this.props} {...this} />;
  }

  public componentWillReceiveProps(props: IContentContainerProps) {
    if (props.schema && this.props.schema !== props.schema) {
      this.setDefaultColumnWidths(props.schema);
    }
    if (this.gridContent && props.rowToHighlight) {
      this.gridContent.scrollToCell({columnIndex: 0, rowIndex: props.rowToHighlight});
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
  }

  public gridContentRef = (grid: Grid) => {
    this.gridContent = grid;
  }

  public gridHeaderRef = (grid: Grid) => {
    this.gridHeader = grid;
  }


  private setDefaultColumnWidths(schema: Realm.ObjectSchema) {
    const columnWidths = Object.keys(schema.properties).map((propertyName) => {
      const property = schema.properties[propertyName] as Realm.ObjectSchemaProperty;
      switch (property.type) {
        case "int":
          return 100;
        case "bool":
          return 100;
        case "string":
          return 300;
        case "date":
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
