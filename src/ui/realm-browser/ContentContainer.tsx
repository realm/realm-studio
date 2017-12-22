import * as electron from 'electron';
import * as React from 'react';

import { EditMode, IPropertyWithName } from '.';
import { ILoadingProgress } from '../reusable/loading-overlay';
import { Content } from './Content';
import { IFocus } from './focus';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './table';

export interface IContentContainerProps {
  changeCount?: number;
  dataVersion?: number;
  editMode?: EditMode;
  focus: IFocus | null;
  highlight?: IHighlight;
  inTransaction?: boolean;
  onAddColumnClick?: () => void;
  onCancelTransaction?: () => void;
  onCellChange?: CellChangeHandler;
  onCellClick?: CellClickHandler;
  onCellHighlighted?: CellHighlightedHandler;
  onCellValidated?: CellValidatedHandler;
  onCommitTransaction?: () => void;
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
    return (
      <Content
        editMode={this.props.editMode || EditMode.InputBlur}
        {...this.state}
        {...this.props}
        {...this}
      />
    );
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
