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

import { Action } from '../../..';

import { ActionCell, IDescription } from './ActionCell';

interface IActionCellContainerProps {
  action: Action;
  description: string | IDescription;
  isTooltipOpen: boolean;
  onToggleTooltip: () => void;
}

interface IActionCellContainerState {
  element: HTMLElement | null;
}

class ActionCellContainer extends React.Component<
  IActionCellContainerProps,
  IActionCellContainerState
> {
  public state: IActionCellContainerState = {
    element: null,
  };

  public render() {
    return (
      <ActionCell
        action={this.props.action}
        description={this.props.description}
        element={this.state.element}
        isTooltipOpen={this.props.isTooltipOpen}
        onRef={this.onRef}
        onToggleTooltip={this.props.onToggleTooltip}
      />
    );
  }

  private onRef = (element: HTMLElement | null) => {
    this.setState({ element });
  };
}

export { ActionCellContainer as ActionCell, IDescription };
