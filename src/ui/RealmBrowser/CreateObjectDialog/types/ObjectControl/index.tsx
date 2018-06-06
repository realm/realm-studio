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

import { IPropertyWithName } from '../../..';
import { IClassFocus } from '../../../focus';
import { IBaseControlProps } from '../TypeControl';

import { ObjectControl } from './ObjectControl';

export interface IObjectControlContainerProps extends IBaseControlProps {
  getClassFocus: (className: string) => IClassFocus;
}

export interface IObjectControlContainerState {
  isObjectSelectorOpen: boolean;
  focus?: IClassFocus;
}

class ObjectControlContainer extends React.Component<
  IObjectControlContainerProps,
  IObjectControlContainerState
> {
  public state: IObjectControlContainerState = {
    isObjectSelectorOpen: false,
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
        focus={this.state.focus}
        isObjectSelectorOpen={this.state.isObjectSelectorOpen}
        property={this.props.property}
        toggleObjectSelector={this.toggleObjectSelector}
        updateObjectReference={this.updateObjectReference}
        value={this.props.value}
      />
    );
  }

  protected toggleObjectSelector = () => {
    this.setState({ isObjectSelectorOpen: !this.state.isObjectSelectorOpen });
  };

  protected updateObjectReference = (object: Realm.Object | null) => {
    this.props.onChange(object);
    this.setState({ isObjectSelectorOpen: false });
  };
}

export { ObjectControlContainer as ObjectControl };
