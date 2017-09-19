import * as React from "react";
import { AutoSizer, Column, Dimensions as IAutoSizerDimensions, MultiGrid } from "react-virtualized";
import * as Realm from "realm";

import { Cell } from "./Cell";
import { HeaderCell } from "./HeaderCell";

export const Content = ({
  columnWidths,
  getObject,
  gridRef,
  onCellChange,
  onListCellClick,
  numberOfObjects,
  onColumnWidthChanged,
  schema,
}: {
  columnWidths: number[],
  getObject: (index: number) => any,
  gridRef: (grid: MultiGrid) => void,
  numberOfObjects: number,
  onCellChange: (object: any, propertyName: string, value: string) => void,
  onListCellClick: () => void,
  onColumnWidthChanged: (index: number, width: number) => void,
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
        const objectIndex = rowIndex - 1;
        const object = getObject(objectIndex);
        return (
          <Cell
            key={key}
            width={columnWidths[columnIndex]}
            style={style}
            onListCellClick={onListCellClick}
            value={object[propertyName]}
            property={property}
            onUpdateValue={(value) => {
              // We subtract 1, as the 0th row is the header.
              onCellChange(object, propertyName, value);
            }}
          />
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
        return (
          <HeaderCell
            key={key}
            property={property}
            propertyName={propertyName}
            width={columnWidths[columnIndex]}
            style={style}
            onWidthChanged={(newWidth) => onColumnWidthChanged(columnIndex, newWidth)}
          />
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
              ref={gridRef}
              rowCount={numberOfObjects + 1}
              columnCount={propertyNames.length}
              columnWidth={({ index }) => columnWidths[index]}
              cellRenderer={(props) => {
                if (props.rowIndex === 0) {
                  return headerRenderers[props.columnIndex](props);
                } else {
                  return columnRenderers[props.columnIndex](props);
                }
              }}
              fixedColumnCount={0}
              fixedRowCount={1}
              rowHeight={({ index }) => index === 0 ? 40 : 26}
              {...styleProps} />
          )}
        </AutoSizer>
      </div>
    );
  } else {
    return (<p>Loading</p>);
  }
};
