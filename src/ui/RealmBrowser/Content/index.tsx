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

import { Content } from './Content';
import {
  CellChangeHandler,
  CellClickHandler,
  CellContextMenuHandler,
  CellHighlightedHandler,
  CellValidatedHandler,
  IHighlight,
  SortEndHandler,
  SortStartHandler,
} from './Table';

export type QueryChangeHandler = (query: string) => void;
export type SortingChangeHandler = (sorting: ISorting | undefined) => void;

export interface ISorting {
  property: IPropertyWithName;
  reverse: boolean;
}

export interface IContentContainerProps {
  changeCount?: number;
  dataVersion?: number;
  editMode?: EditMode;
  focus: Focus;
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
  sorting: ISorting | undefined;
}

class ContentContainer extends React.Component<
  IContentContainerProps,
  IContentContainerState
> {
  public state: IContentContainerState = {
    query: '',
    sorting: undefined,
  };

  public componentDidUpdate(
    prevProps: IContentContainerProps,
    prevState: IContentContainerState,
  ) {
    if (
      this.state.query !== prevState.query ||
      this.state.sorting !== prevState.sorting
    ) {
      this.props.onResetHighlight();
    }
  }

  public componentWillReceiveProps(props: IContentContainerProps) {
    // TODO: Test that this actually works
    if (props.focus && this.props.focus !== props.focus) {
      this.setState({ sorting: undefined });
    }
  }

  public render() {
    const filteredSortedResults = this.getFilteredSortedResults({
      query: this.state.query,
      sorting: this.state.sorting,
    });
    return (
      <Content
        editMode={this.props.editMode || EditMode.InputBlur}
        onTableBackgroundClick={this.onTableBackgroundClick}
        filteredSortedResults={filteredSortedResults}
        onQueryChange={this.onQueryChange}
        onQueryHelp={this.onQueryHelp}
        onSortingChange={this.onSortingChange}
        {...this.state}
        {...this.props}
      />
    );
  }

  private onQueryChange = (query: string) => {
    this.setState({ query });
  };

  private onQueryHelp = () => {
    const url =
      'https://realm.io/docs/javascript/latest/api/tutorial-query-language.html';
    electron.shell.openExternal(url);
  };

  private onSortingChange: SortingChangeHandler = sorting => {
    this.setState({ sorting });
  };

  private onTableBackgroundClick = () => {
    // When clicking outside a cell. Reset the highlight.
    this.props.onResetHighlight();
  };

  private getFilteredSortedResults({
    query,
    sorting,
  }: {
    query?: string;
    sorting?: ISorting;
  }): Realm.Collection<any> {
    let results = this.props.focus.results;
    if (query) {
      try {
        results = results.filtered(query);
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.warn(`Could not filter on "${query}"`, err);
      }
    }

    if (sorting) {
      const propertyName = sorting.property.name;
      if (propertyName) {
        results = results.sorted(propertyName, sorting.reverse);
      }
    }
    return results;
  }
}

export { ContentContainer as Content };
