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

import React from 'react';

import { Content } from '..';
import { IClassFocus } from '../../focus';
import { IHighlight } from '../Table';

import {
  ISelectObjectDialogProps,
  SelectObjectDialog,
} from './SelectObjectDialog';
import { IsEmbeddedTypeChecker, JsonViewerDialogExecutor } from '../..';

export interface IClosedSelectObjectDialogContainerProps {
  isOpen: false;
}

export interface IOpenSelectObjectDialogContainerProps {
  focus: IClassFocus;
  isOpen: true;
  isOptional: boolean;
  multiple: boolean;
  onCancel: () => void;
  isEmbeddedType: IsEmbeddedTypeChecker;
  onShowJsonViewerDialog: JsonViewerDialogExecutor;
}

export interface IOpenSelectSingleObjectDialogContainerProps
  extends IOpenSelectObjectDialogContainerProps {
  multiple: false;
  onSelect: (object: Realm.Object | null) => void;
}

export interface IOpenSelectMultipleObjectsDialogContainerProps
  extends IOpenSelectObjectDialogContainerProps {
  multiple: true;
  onSelect: (object: Realm.Object[]) => void;
}

export type ISelectObjectDialogContainerProps =
  | IClosedSelectObjectDialogContainerProps
  | IOpenSelectSingleObjectDialogContainerProps
  | IOpenSelectMultipleObjectsDialogContainerProps;

export interface ISelectObjectDialogContainerState {
  selection: Realm.Object[];
}

export class SelectObjectDialogContainer extends React.Component<
  ISelectObjectDialogContainerProps,
  ISelectObjectDialogContainerState
> {
  public state: ISelectObjectDialogContainerState = {
    selection: [],
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
        isOptional: this.props.isOptional,
        onHighlightChange: this.onHighlightChange,
        onDeselect: this.onDeselect,
        contentRef: this.contentRef,
        selection: this.state.selection,
        multiple: this.props.multiple,
        isEmbeddedType: this.props.isEmbeddedType,
        onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
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

  private onHighlightChange = (
    highlight: IHighlight | undefined,
    collection: Realm.OrderedCollection<any>,
  ) => {
    // Gather the selected objects
    const selection = highlight
      ? [...highlight.rows].map(index => collection[index])
      : [];
    this.setState({ selection });
  };

  private onSelect = () => {
    if (this.props.isOpen) {
      if (this.props.multiple) {
        this.props.onSelect(this.state.selection);
      } else {
        if (this.state.selection.length > 0) {
          this.props.onSelect(this.state.selection[0]);
        } else {
          this.props.onSelect(null);
        }
      }
    }
  };

  private onDeselect = () => {
    if (this.contentInstance) {
      this.contentInstance.highlightObject(null);
    }
  };

  private onCancel = () => {
    if (this.props.isOpen) {
      this.props.onCancel();
    }
  };
}

export { SelectObjectDialogContainer as SelectObjectDialog };
