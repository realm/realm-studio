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

import * as React from 'react';

import { QuerySearch } from './QuerySearch';

export interface IQuerySearchContainerProps {
  onQueryChange: (query: string) => void;
  onQueryHelp?: () => void;
  queryHelpTooltip?: JSX.Element;
  query: string;
  queryError?: Error;
  placeholder: string;
  className?: string;
}

interface IQuerySearchContainerState {
  inputElement?: HTMLInputElement;
  isPopoverOpen: boolean;
}

class QuerySearchContainer extends React.Component<
  IQuerySearchContainerProps,
  IQuerySearchContainerState
> {
  public state: IQuerySearchContainerState = {
    isPopoverOpen: false,
  };

  public render() {
    return (
      <QuerySearch
        className={this.props.className}
        onQueryChange={this.props.onQueryChange}
        onQueryHelp={this.props.onQueryHelp}
        onQueryFocus={this.onQueryFocus}
        onQueryBlur={this.onQueryBlur}
        query={this.props.query}
        queryError={this.props.queryError}
        placeholder={this.props.placeholder}
        inputRef={this.inputRef}
        inputElement={this.state.inputElement}
        isPopoverOpen={this.state.isPopoverOpen}
        queryHelpTooltip={this.props.queryHelpTooltip}
      />
    );
  }

  private inputRef = (inputElement: HTMLInputElement) => {
    this.setState({ inputElement });
  };

  private onQueryFocus = () => {
    this.setState({ isPopoverOpen: true });
  };

  private onQueryBlur = () => {
    this.setState({ isPopoverOpen: false });
  };
}

export { QuerySearchContainer as QuerySearch };
