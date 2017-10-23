import * as React from 'react';
import { Grid, GridCellProps } from 'react-virtualized';

import { IPropertyWithName } from '.';
import { ILoadingProgress } from '../reusable/loading-overlay';
import { Content } from './Content';
import { IFocus } from './focus';
import { CellChangeHandler, CellClickHandler, IHighlight } from './table';
import { Cell } from './table/Cell';
import { HeaderCell } from './table/HeaderCell';

export interface IContentContainerProps {
  focus: IFocus | null;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  progress?: ILoadingProgress;
  onContextMenu?: (
    e: React.SyntheticEvent<any>,
    object: any,
    rowIndex: number,
    property: Realm.ObjectSchemaProperty,
  ) => void;
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
