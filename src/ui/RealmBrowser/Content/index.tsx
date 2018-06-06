////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as electron from 'electron';
import * as React from 'react';

import { EditMode, IPropertyWithName } from '..';
import { ILoadingProgress } from '../../reusable/LoadingOverlay';
import { Focus } from '../focus';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from '../Table';

import { Content } from './Content';

export interface IContentContainerProps {
  changeCount?: number;
  dataVersion?: number;
  editMode?: EditMode;
  focus: Focus | null;
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
  onNewObjectClick?: () => void;
  onResetHighlight: () => void;
  onSortEnd?: SortEndHandler;
  onSortStart?: SortStartHandler;
  progress?: ILoadingProgress;
}

export interface IContentContainerState {
  query: string;
}

class ContentContainer extends React.Component<
  IContentContainerProps,
  IContentContainerState
> {
  public state: IContentContainerState = {
    query: '',
  };

  public componentDidUpdate(
    prevProps: IContentContainerProps,
    prevState: IContentContainerState,
  ) {
    if (this.state.query !== prevState.query) {
      this.props.onResetHighlight();
    }
  }

  public render() {
    return (
      <Content
        editMode={this.props.editMode || EditMode.InputBlur}
        onTableBackgroundClick={this.onTableBackgroundClick}
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

  protected onTableBackgroundClick = () => {
    // When clicking outside a cell. Reset the highlight.
    this.props.onResetHighlight();
  };
}

export { ContentContainer as Content };
