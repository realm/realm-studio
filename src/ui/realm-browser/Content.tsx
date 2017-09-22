import * as React from "react";
import { AutoSizer, Dimensions as IAutoSizerDimensions, Grid, ScrollSync } from "react-virtualized";
import * as Realm from "realm";

import { Cell } from "./Cell";
import { HeaderCell } from "./HeaderCell";

export const Content = ({
  columnWidths,
  getObject,
  gridContentRef,
  gridHeaderRef,
  onCellChange,
  onListCellClick,
  numberOfObjects,
  onColumnWidthChanged,
  schema,
  rowToHighlight,
}: {
  columnWidths: number[],
  getObject: (index: number) => any,
  gridContentRef: (grid: Grid) => void,
  gridHeaderRef: (grid: Grid) => void,
  numberOfObjects: number,
  onCellChange: (object: any, propertyName: string, value: string) => void,
  onListCellClick: (object: any, property: Realm.ObjectSchemaProperty, value: any) => void,
  onColumnWidthChanged: (index: number, width: number) => void,
  schema: Realm.ObjectSchema | null,
  rowToHighlight: number | null,
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
            onListCellClick={(property: Realm.ObjectSchemaProperty, value: any) => {
              onListCellClick(object, property, value);
            }}
            value={object[propertyName]}
            property={property}
            onUpdateValue={(value) => {
              onCellChange(object, propertyName, value);
            }}
            isHighlight={rowToHighlight === objectIndex}
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

    const headerHeight = 40;
    const rowHeight = 26;
    const scrollBarWidth = 20;

    return (
      <ScrollSync>
        {({clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => (
          <div className="RealmBrowser__Content">
            <AutoSizer>
              {({height, width}: IAutoSizerDimensions) => (
                <Grid
                  width={width - scrollBarWidth}
                  className="RealmBrowser__Content__Header"
                  height={headerHeight}
                  ref={gridHeaderRef}
                  rowCount={1}
                  columnCount={propertyNames.length}
                  columnWidth={({index}) => columnWidths[index]}
                  cellRenderer={(props) => headerRenderers[props.columnIndex](props)}
                  scrollLeft={scrollLeft}
                  rowHeight={({index}) => index === 0 ? headerHeight : rowHeight}
                />
              )}
            </AutoSizer>
            <AutoSizer>
              {({height, width}: IAutoSizerDimensions) => (
                <Grid
                  width={width}
                  height={height - headerHeight}
                  style={{marginTop: headerHeight}}
                  ref={gridContentRef}
                  rowCount={numberOfObjects + 1}
                  columnCount={propertyNames.length}
                  columnWidth={({index}) => columnWidths[index]}
                  cellRenderer={(props) => {
                    if (props.rowIndex === 0) {
                      return null;
                    } else {
                      return columnRenderers[props.columnIndex](props);
                    }
                  }}
                  onScroll={onScroll}
                  rowHeight={({index}) => index === 0 ? 0 : rowHeight}
                />
              )}
            </AutoSizer>
          </div>
        )}
      </ScrollSync>
    );
  } else {
    return (<p>Loading</p>);
  }
};
