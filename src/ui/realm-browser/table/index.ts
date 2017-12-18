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

export type CellHighlightedHandler = (highlight: IHighlight) => void;
export interface IHighlight {
  row?: number;
  column?: number;
  center?: boolean;
}

export interface ISorting {
  property: IPropertyWithName;
  reverse: boolean;
}

export type SortClickHandler = (property: IPropertyWithName) => void;
