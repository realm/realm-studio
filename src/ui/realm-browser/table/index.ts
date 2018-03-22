export { SortEndHandler, SortStartHandler } from 'react-sortable-hoc';

import { IPropertyWithName } from '..';

export type CellChangeHandler = (
  params: {
    parent: any;
    property: IPropertyWithName;
    rowIndex: number;
    cellValue: any;
  },
) => void;

export type CellClickHandler = (
  params: {
    rowObject: any;
    property: IPropertyWithName;
    cellValue: any;
    rowIndex: number;
    columnIndex: number;
  },
  e?: React.MouseEvent<any>,
) => void;

export type CellContextMenuHandler = (
  e: React.MouseEvent<any>,
  params?: {
    rowObject: any;
    property: IPropertyWithName;
    cellValue: any;
    rowIndex: number;
    columnIndex: number;
  },
) => void;

export type CellHighlightedHandler = (
  cell: { rowIndex: number; columnIndex: number },
) => void;

export type CellValidatedHandler = (
  rowIndex: number,
  columnIndex: number,
  valid: boolean,
) => void;

export interface IHighlight {
  rows: Set<number>;
  column?: number;
  center?: boolean;
  lastRowIndexClicked?: number;
}

export interface ISorting {
  property: IPropertyWithName;
  reverse: boolean;
}

export type SortClickHandler = (property: IPropertyWithName) => void;
