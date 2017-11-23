import * as electron from 'electron';
import * as React from 'react';
import { Grid, GridCellProps } from 'react-virtualized';

import { EditMode, IPropertyWithName } from '.';
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
import { Cell } from './table/Cell';
import { HeaderCell } from './table/HeaderCell';

export interface IContentContainerProps {
  changeCount?: number;
  dataVersion?: number;
  editMode?: EditMode;
  focus: IFocus | null;
  highlight?: IHighlight;
  inTransaction: boolean;
  onCancelTransaction: () => void;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCommitTransaction: () => void;
  onContextMenu?: CellContextMenuHandler;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
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

  public render() {
    return <Content {...this.state} {...this.props} {...this} />;
  }

  public onQueryChange = (query: string) => {
    this.setState({ query });
  };

  public onQueryHelp = () => {
    const url =
      'https://realm.io/docs/javascript/latest/api/tutorial-query-language.html';
    electron.shell.openExternal(url);
  };
}
