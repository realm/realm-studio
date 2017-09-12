import * as React from "react";
import { AutoSizer, Column, Dimensions as IAutoSizerDimensions, MultiGrid } from "react-virtualized";
import * as Realm from "realm";

import { Cell } from "./Cell";
import { HeaderCell } from "./HeaderCell";

export const Content = ({
  getColumnWidth,
  getObject,
  numberOfObjects,
  schema,
}: {
  getColumnWidth: (index: number) => any,
  getObject: (index: number) => any,
  numberOfObjects: number,
  schema: Realm.ObjectSchema | null,
}) => {
  if (schema) {
    // Generate the columns from the schemas properties
    const propertyNames = Object.keys(schema.properties);
    const columnRenderers = propertyNames.map((propertyName) => {
      const property = schema.properties[propertyName] as Realm.ObjectSchemaProperty;
      return ({
        columnIndex,
        key,
        rowIndex,
        style,
      }: {
        columnIndex: number,
        key: string,
        rowIndex: number,
        style: React.CSSProperties,
      }) => {
        // We subtract 1, as the 0th row is the header.
        const object = getObject(rowIndex - 1);
        const width = getColumnWidth(columnIndex);
        return (
          <Cell key={key} value={object[propertyName]} property={property} width={width} style={style} />
        );
      };
    });

    const headerRenderers = propertyNames.map((propertyName) => {
      const property = schema.properties[propertyName] as Realm.ObjectSchemaProperty;
      return ({
        columnIndex,
        key,
        style,
      }: {
        columnIndex: number,
        key: string,
        style: React.CSSProperties,
      }) => {
        const width = getColumnWidth(columnIndex);
        return (
          <HeaderCell key={key} property={property} width={width} style={style} propertyName={propertyName} />
        );
      };
    });

    const styleProps = {
      style: {},
      styleBottomLeftGrid: {},
      styleBottomRightGrid: {},
      styleTopLeftGrid: {},
      styleTopRightGrid: {},
    };

    return (
      <div className="RealmBrowser__Content">
        <AutoSizer>
          {({ height, width }: IAutoSizerDimensions) => (
            <MultiGrid width={width} height={height}
              rowCount={numberOfObjects}
              columnCount={propertyNames.length}
              columnWidth={({ index }) => getColumnWidth(index)}
              cellRenderer={(props) => {
                if (props.rowIndex === 0) {
                  return headerRenderers[props.columnIndex](props);
                } else {
                  return columnRenderers[props.columnIndex](props);
                }
              }}
              fixedColumnCount={0}
              fixedRowCount={1}
              rowHeight={26}
              {...styleProps} />
          )}
        </AutoSizer>
      </div>
    );
  } else {
    return (<p>Loading</p>);
  }
};
