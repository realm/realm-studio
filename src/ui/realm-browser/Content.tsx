import * as React from 'react';
import {
  AutoSizer,
  Dimensions as IAutoSizerDimensions,
  Grid,
  ScrollSync,
} from 'react-virtualized';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import * as Realm from 'realm';
import { Cell } from './Cell';
import { HeaderCell } from './HeaderCell';

export const Content = ({
  columnWidths,
  gridContentRef,
  gridHeaderRef,
  onCellChange,
  onCellClick,
  onColumnWidthChanged,
  schema,
  rowToHighlight,
  data,
  query,
  onQueryChange,
  sort,
  onSortClick,
  onContextMenu,
  onRowClick,
}: {
  columnWidths: number[];
  gridContentRef: (grid: Grid) => void;
  gridHeaderRef: (grid: Grid) => void;
  onCellChange?: (object: any, propertyName: string, value: string) => void;
  onListCellClick?: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onColumnWidthChanged: (index: number, width: number) => void;
  schema: Realm.ObjectSchema | null;
  rowToHighlight?: number | null;
  data: Realm.Results<any> | any;
  query: string | null;
  onQueryChange: (e: React.SyntheticEvent<any>) => void;
  sort: string | null;
  onSortClick: (property: string) => void;
  onContextMenu?: (
    e: React.SyntheticEvent<any>,
    object: any,
    property: Realm.ObjectSchemaProperty,
  ) => void;
  onRowClick?: (
    object: any,
    property: Realm.ObjectSchemaProperty,
    value: any,
  ) => void;
}) => {
  if (schema) {
    // Generate the columns from the schemas properties
    const propertyNames = Object.keys(schema.properties);
    const columnRenderers = propertyNames.map(propertyName => {
      const property = schema.properties[
        propertyName
      ] as Realm.ObjectSchemaProperty;
      return ({
        columnIndex,
        key,
        rowIndex,
        style,
      }: {
        columnIndex: number;
        key: string;
        rowIndex: number;
        style: React.CSSProperties;
      }) => {
        const object = data[rowIndex];

        const cell = (
          <Cell
            key={key}
            width={columnWidths[columnIndex]}
            style={style}
            onCellClick={(
              property: Realm.ObjectSchemaProperty, // tslint:disable-line:no-shadowed-variable
              value: any,
            ) => onListCellClick && onListCellClick(object, property, value)}
            value={object[propertyName]}
            property={property}
            onUpdateValue={value =>
              onCellChange && onCellChange(object, propertyName, value)}
            isHighlight={rowToHighlight === rowIndex}
            onContextMenu={e =>
              onContextMenu && onContextMenu(e, object, property)}
          />
        );

        return onRowClick ? (
          <div
            key={key}
            style={{ userSelect: 'none', cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onRowClick(object, property, object[propertyName]);
            }}
          >
            {cell}
          </div>
        ) : (
          cell
        );
      };
    });

    const headerRenderers = propertyNames.map(propertyName => {
      const property = schema.properties[
        propertyName
      ] as Realm.ObjectSchemaProperty;
      return ({
        columnIndex,
        key,
        style,
      }: {
        columnIndex: number;
        key: string;
        style: React.CSSProperties;
      }) => {
        return (
          <HeaderCell
            key={key}
            property={property}
            propertyName={propertyName}
            width={columnWidths[columnIndex]}
            style={style}
            onWidthChanged={newWidth =>
              onColumnWidthChanged(columnIndex, newWidth)}
            onSortClick={onSortClick}
            sort={sort}
          />
        );
      };
    });

    const headerHeight = 40;
    const rowHeight = 26;
    const scrollBarWidth = 20;

    return (
      <div className="RealmBrowser__Content">
        <div className="RealmBrowser__Content__Actions">
          <InputGroup className="RealmBrowser__Content__Actions__Filter">
            <InputGroupAddon>
              <i className="fa fa-search" aria-hidden="true" />
            </InputGroupAddon>
            <Input
              placeholder="Query ..."
              onChange={onQueryChange}
              value={query || ''}
            />
          </InputGroup>
        </div>
        <ScrollSync>
          {({
            clientHeight,
            clientWidth,
            onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
          }) => (
            <div style={{ position: 'relative', flex: '1 1 auto' }}>
              <AutoSizer>
                {({ height, width }: IAutoSizerDimensions) => (
                  <div>
                    <Grid
                      width={width - scrollBarWidth}
                      className="RealmBrowser__Content__Header"
                      height={headerHeight}
                      ref={gridHeaderRef}
                      rowCount={1}
                      columnCount={propertyNames.length}
                      columnWidth={({ index }) => columnWidths[index]}
                      cellRenderer={props =>
                        headerRenderers[props.columnIndex](props)}
                      scrollLeft={scrollLeft}
                      rowHeight={headerHeight}
                    />
                    <Grid
                      width={width}
                      height={height - headerHeight}
                      ref={gridContentRef}
                      rowCount={data.length}
                      columnCount={propertyNames.length}
                      columnWidth={({ index }) => columnWidths[index]}
                      cellRenderer={props =>
                        columnRenderers[props.columnIndex](props)}
                      onScroll={onScroll}
                      rowHeight={rowHeight}
                    />
                  </div>
                )}
              </AutoSizer>
            </div>
          )}
        </ScrollSync>
      </div>
    );
  } else {
    return <p>Loading</p>;
  }
};
