import * as React from 'react';
import { GridCellRenderer } from 'react-virtualized';

import { ICellChangeOptions } from '../RealmBrowserContainer';

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

export abstract class Focus {
  public abstract generateRenderers(
    params: IRendererParams,
  ): {
    columnCount: number;
    rowCount: number;
    headerRenderers: GridCellRenderer[];
    valueRenderers: GridCellRenderer[];
  };
  public abstract isFocussingOn(className: string): boolean;
}
