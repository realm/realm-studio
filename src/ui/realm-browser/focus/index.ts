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
  properties: IPropertyWithName[];
  results: Realm.Collection<any>;
}

export interface IClassFocus extends IFocus {
  kind: 'class';
  results: Realm.Results<any>;
  className: string;
  enableAddColumn?: boolean;
}

export interface IListFocus extends IFocus {
  kind: 'list';
  parent: Realm.Object;
  property: IPropertyWithName;
  results: Realm.List<any>;
}

export type Focus = IClassFocus | IListFocus;
