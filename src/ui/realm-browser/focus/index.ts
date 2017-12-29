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
  addColumnEnabled?: boolean;
}

export interface IClassFocus extends IFocus {
  kind: 'class';
  results: Realm.Results<any>;
  className: string;
}

export interface IListFocus extends IFocus {
  kind: 'list';
  parent: Realm.Object;
  property: IPropertyWithName;
  results: Realm.List<any>;
  addColumnEnabled?: false;
}

export type Focus = IClassFocus | IListFocus;

export const getClassName = (focus: Focus | IFocus): string | undefined =>
  (focus as IClassFocus).className || (focus as IListFocus).property.objectType;
