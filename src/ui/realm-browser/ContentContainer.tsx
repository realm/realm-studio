import * as React from 'react';
import { Grid, GridCellProps } from 'react-virtualized';

import { IPropertyWithName } from '.';
import { ILoadingProgress } from '../reusable/loading-overlay';
import { Content } from './Content';
import { IFocus } from './focus';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  SortEndHandler,
} from './table';
import { Cell } from './table/Cell';
import { HeaderCell } from './table/HeaderCell';

export interface IContentContainerProps {
  dataVersion?: number;
  focus: IFocus | null;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onContextMenu?: CellContextMenuHandler;
  onSortEnd?: SortEndHandler;
  progress?: ILoadingProgress;
}

export interface IContentContainerState {
  query: string;
}

export class ContentContainer extends React.Component<
  IContentContainerProps,
  IContentContainerState
> {
  constructor() {
    super();
    this.state = {
      query: '',
    };
  }

  public onQueryChange = (query: string) => {
    this.setState({ query });
  };

  public render() {
    return <Content {...this.state} {...this.props} {...this} />;
  }
}
