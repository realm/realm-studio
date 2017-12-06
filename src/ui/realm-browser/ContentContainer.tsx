import * as React from 'react';

import { ILoadingProgress } from '../reusable/loading-overlay';
import { Content } from './Content';
import { IFocus } from './focus';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './table';

export interface IContentContainerProps {
  dataVersion?: number;
  focus: IFocus | null;
  hasEditingDisabled?: boolean;
  highlight?: IHighlight;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onContextMenu?: CellContextMenuHandler;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  progress?: ILoadingProgress;
  onAddColumnClick?: () => void;
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
