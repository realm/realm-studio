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
import { IHighlight } from '../Table';

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
  multiple: boolean;
  onCancel: () => void;
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
  highlight: IHighlight;
}

export class SelectObjectDialogContainer extends React.Component<
  ISelectObjectDialogContainerProps,
  ISelectObjectDialogContainerState
> {
  public state: ISelectObjectDialogContainerState = {
    highlight: { rows: new Set() },
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
        onHighlightChange: this.onHighlightChange,
        onDeselect: this.onDeselect,
        contentRef: this.contentRef,
        multiple: this.props.multiple,
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

  private onHighlightChange = (highlight: IHighlight | undefined) => {
    this.setState({ highlight: highlight || { rows: new Set() } });
  };

  private onSelect = () => {
    if (this.props.isOpen) {
      if (this.props.multiple) {
        const objects = this.props.focus.results.filter((object, index) => {
          return this.state.highlight.rows.has(index);
        });
        this.props.onSelect(objects);
      } else {
        if (this.state.highlight.rows.size > 0) {
          const firstIndex = this.state.highlight.rows.values().next().value;
          const firstObject = this.props.focus.results[firstIndex];
          this.props.onSelect(firstObject);
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
