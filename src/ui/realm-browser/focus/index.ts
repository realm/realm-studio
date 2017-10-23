/*
export * from './ClassFocus';
export * from './Focus';
export * from './ListFocus';
*/

import { GridCellRenderer } from 'react-virtualized';

import { IPropertyWithName } from '..';

export interface IRenderers {
  columnCount: number;
  rowCount: number;
  headerRenderers: GridCellRenderer[];
  valueRenderers: GridCellRenderer[];
}

export interface IFocus {
  kind: string;
  results: Realm.Results<any>;
  properties: IPropertyWithName[];
}

export interface IClassFocus extends IFocus {
  kind: 'class';
  className: string;
}

export interface IListFocus extends IFocus {
  kind: 'list';
  parent: Realm.Object;
  property: IPropertyWithName;
}
