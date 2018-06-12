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

import { CellClickHandler, IHighlight } from '../Content/Table';
import { IClassFocus } from '../focus';

import { ObjectSelector } from './ObjectSelector';

export interface ISelectObjectProps {
  toggle: () => void;
  focus: IClassFocus;
  isOptional?: boolean;
  onObjectSelected: (object: Realm.Object | null) => void;
  isOpen: boolean;
}

export interface ISelectObjectState {
  highlight?: IHighlight;
  selectedObject: Realm.Object | null;
}

export class ObjectSelectorContainer extends React.Component<
  ISelectObjectProps,
  ISelectObjectState
> {
  public state: ISelectObjectState = {
    selectedObject: null,
  };

  public render() {
    return (
      <ObjectSelector
        focus={this.props.focus}
        isOpen={this.props.isOpen}
        isOptional={this.props.isOptional || false}
        onCellClick={this.onCellClick}
        onResetHighlight={this.onResetHighlight}
        onSelectObject={this.onSelectObject}
        toggle={this.props.toggle}
        {...this.state}
      />
    );
  }

  private onCellClick: CellClickHandler = ({
    rowObject,
    cellValue,
    rowIndex,
    columnIndex,
  }) => {
    this.setState({
      highlight: {
        column: columnIndex,
        rows: new Set([rowIndex]),
      },
      selectedObject: rowObject,
    });
  };

  private onResetHighlight = () => {
    this.setState({
      highlight: {
        column: 0,
        rows: new Set([]),
      },
      selectedObject: null,
    });
  };

  private onSelectObject = () =>
    this.props.onObjectSelected(this.state.selectedObject);
}

export { ObjectSelectorContainer as ObjectSelector };
