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
import * as Realm from 'realm';

import { IClassFocus } from '../../../../focus';
import { IBaseControlProps } from '../TypeControl';

import { ObjectControl } from './ObjectControl';

export interface IOpenSelectObjectDialog {
  isOpen: true;
  focus: IClassFocus;
  isOptional: boolean;
  onCancel: () => void;
  onSelect: (object: any) => void;
}

export type ISelectObjectDialog = IOpenSelectObjectDialog | { isOpen: false };

export interface IObjectControlContainerProps extends IBaseControlProps {
  getClassFocus: (className: string) => IClassFocus;
}

export interface IObjectControlContainerState {
  selectObjectDialog: ISelectObjectDialog;
  focus?: IClassFocus;
}

class ObjectControlContainer extends React.Component<
  IObjectControlContainerProps,
  IObjectControlContainerState
> {
  public state: IObjectControlContainerState = {
    selectObjectDialog: { isOpen: false },
  };

  public componentDidMount() {
    if (this.props.property.objectType) {
      const className = this.props.property.objectType;
      this.setState({
        focus: this.props.getClassFocus(className),
      });
    }
  }

  public render() {
    return (
      <ObjectControl
        children={this.props.children}
        selectObjectDialog={this.state.selectObjectDialog}
        property={this.props.property}
        onShowSelectObjectDialog={this.onShowSelectObjectDialog}
        updateObjectReference={this.updateObjectReference}
        value={this.props.value}
      />
    );
  }

  protected onShowSelectObjectDialog = () => {
    if (this.state.focus) {
      this.setState({
        selectObjectDialog: {
          isOpen: true,
          focus: this.state.focus,
          isOptional: this.props.property.optional || false,
          onCancel: this.onCancelSelectObjectDialog,
          onSelect: this.updateObjectReference,
        },
      });
    }
  };

  protected onCancelSelectObjectDialog = () => {
    this.setState({ selectObjectDialog: { isOpen: false } });
  };

  protected updateObjectReference = (object: Realm.Object | null) => {
    this.props.onChange(object);
    this.setState({ selectObjectDialog: { isOpen: false } });
  };
}

export { ObjectControlContainer as ObjectControl };
