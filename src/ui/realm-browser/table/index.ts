export { SortEndHandler } from 'react-sortable-hoc';

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

export interface IHighlight {
  row?: number;
  column?: number;
}

export interface ISorting {
  property: IPropertyWithName;
  reverse: boolean;
}

export type SortClickHandler = (property: IPropertyWithName) => void;
