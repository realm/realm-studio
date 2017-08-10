import * as React from "react";
import { AutoSizer, MultiGrid } from "react-virtualized";
import * as Realm from "realm";

// Can't get it working with TS, see https://github.com/mzabriskie/react-draggable/issues/246
// tslint:disable-next-line:no-var-requires
const Draggable: any = require("react-draggable");

interface IContentProps extends React.Props<{}> {
  realm: Realm;
  type: Realm.ObjectSchema;
}

interface IContentState {
  columnWidths: number[];
}

export default class Content extends React.Component<IContentProps, IContentState> {
  private grid: MultiGrid;

  private objects: Realm.Results<Realm.Object>;
  private propertyNames: string[];

  constructor(props: IContentProps) {
    super(props);

    this.objects = this.props.realm.objects(this.props.type.name);
    this.propertyNames = Object.keys(this.props.type.properties);

    this.state = {
      columnWidths: [],
    };
  }

  public componentWillReceiveProps(nextProps: IContentProps) {
    this.objects = nextProps.realm.objects(nextProps.type.name);
    this.propertyNames = Object.keys(nextProps.type.properties);

    this.state = {
      columnWidths: [],
    };
    this.grid.recomputeGridSize();
  }

  public render() {
    const numberOfRows = this.objects.length + 1; // + header row
    const numberOfColumns = Object.keys(this.props.type.properties).length;

    return (
      <div className="RealmBrowser__content">
        <AutoSizer>
          {({ height, width }) => (
            <MultiGrid
              ref={(grid: MultiGrid) => { this.grid = grid; }}
              cellRenderer={(params) => {
                if (params.rowIndex === 0) {
                  return this.renderHeaderCell(params);
                } else {
                  params.rowIndex -= 1;
                  return this.renderCell(params);
                }
              }}
              width={width}
              height={height}
              columnCount={numberOfColumns}
              columnWidth={(params) => this.getColumWidth(params.index)}
              fixedRowCount={1}
              fixedColumnCount={0}
              style={{}}
              styleBottomLeftGrid={{}}
              styleBottomRightGrid={{}}
              styleTopLeftGrid={{}}
              styleTopRightGrid={{}}
              rowCount={numberOfRows}
              rowHeight={(params) => params.index === 0 ? 40 : 26}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  private propertyAtIndex(index: number): Realm.ObjectSchemaProperty {
    const propertyName = this.propertyNames[index];
    return this.props.type.properties[propertyName] as Realm.ObjectSchemaProperty;
  }

  private propertyTypeStringForProperty(property: Realm.ObjectSchemaProperty): string {
    switch (property.type) {
      case "linkingObjects":
        return property.objectType!;
      case "list":
        return `[${property.objectType}]`;
      default:
        return property.type;
    }
  }

  private objectValue(rowIndex: number, columnIndex: number): string {
    const property = this.propertyAtIndex(columnIndex);
    const propertyName = this.propertyNames[columnIndex];
    const object = this.objects[rowIndex] as any;

    // FIXME: Electron and it's garbage collector don't like ArrayBuffer
    if (property.type === "data") {
      return "<Data>";
    }

    const value = object[propertyName];

    if (value === undefined || value === null) {
      return "null";
    }

    switch (property.type) {
      case "date":
        return value.toLocaleString();
      case "linkingObject":
        return `<${property.objectType}>`;
      case "list":
        const numberOfObjects = Object.keys(value).length;
        return `${numberOfObjects} object${numberOfObjects !== 1 ? "s" : ""}`;
      default:
        return value.toString();
    }
  }

  private getColumWidth(index: number): number {
    if (this.state.columnWidths[index]) {
      return this.state.columnWidths[index];
    }

    const property = this.propertyAtIndex(index);

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
  }

  private setColumnWidth(index: number, width: number) {
    const columnWidths = this.state.columnWidths;
    columnWidths[index] = Math.max(width, 50);

    this.setState({
      columnWidths,
    });

    this.grid.recomputeGridSize();
  }

  private renderHeaderCell(params: any) {
    const propertyName = this.propertyNames[params.columnIndex];
    const property = this.propertyAtIndex(params.columnIndex);

    return (
      <div key={params.key} style={params.style} className="headerCell">
        <div className="propertyName">{propertyName}</div>
        <div className="propertyType">{this.propertyTypeStringForProperty(property)}</div>
        <Draggable
          axis="x"
          position={{ x: this.getColumWidth(params.columnIndex) - 10, y: 0 }}
          onDrag={(event: any, data: any) => this.setColumnWidth(params.columnIndex, data.x + 10)}
        >
          <div className="resizeHandle"></div>
        </Draggable>
      </div>
    );
  }

  private renderCell(params: any) {
    return (
      <div key={params.key} style={params.style} className={`cell${params.rowIndex % 2 === 1 ? " alternate" : ""}`}>
        {this.objectValue(params.rowIndex, params.columnIndex)}
      </div>
    );
  }
}
