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

import { Content } from '..';
import { IClassFocus } from '../../focus';
import { CellClickHandler, IHighlight } from '../Table';

import {
  ISelectObjectDialogProps,
  SelectObjectDialog,
} from './SelectObjectDialog';

export interface IClosedSelectObjectDialogContainerProps {
  isOpen: false;
}

export interface IOpenSelectObjectDialogContainerProps {
  focus: IClassFocus;
  isOpen: true;
  isOptional: boolean;
  onCancel: () => void;
  onSelect: (object: Realm.Object | null) => void;
}

export type ISelectObjectDialogContainerProps =
  | IClosedSelectObjectDialogContainerProps
  | IOpenSelectObjectDialogContainerProps;

export interface ISelectObjectDialogContainerState {
  highlight?: IHighlight;
  selectedObject: Realm.Object | null;
}

export class SelectObjectDialogContainer extends React.Component<
  ISelectObjectDialogContainerProps,
  ISelectObjectDialogContainerState
> {
  public state: ISelectObjectDialogContainerState = {
    selectedObject: null,
  };

  private contentInstance: Content | null = null;

  public render() {
    const props = this.getProps();
    return <SelectObjectDialog {...props} />;
  }

  private getProps(): ISelectObjectDialogProps {
    const common = {
      onCancel: this.onCancel,
      onSelect: this.onSelect,
    };
    if (this.props.isOpen) {
      return {
        ...common,
        isOpen: true,
        focus: this.props.focus,
        highlight: this.state.highlight,
        isOptional: this.props.isOptional,
        onCellClick: this.onCellClick,
        selectedObject: this.state.selectedObject,
        contentRef: this.contentRef,
      };
    } else {
      return {
        ...common,
        isOpen: false,
      };
    }
  }

  private contentRef = (instance: Content | null) => {
    this.contentInstance = instance;
  };

  private onCellClick: CellClickHandler = ({ rowObject }) => {
    this.setState({ selectedObject: rowObject });
    if (this.contentInstance) {
      this.contentInstance.highlightObject(rowObject);
    }
  };

  private onSelect = () => {
    if (this.props.isOpen) {
      this.props.onSelect(this.state.selectedObject);
    }
  };

  private onCancel = () => {
    if (this.props.isOpen) {
      this.props.onCancel();
    }
  };
}

export { SelectObjectDialogContainer as SelectObjectDialog };
