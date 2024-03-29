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

import { IClassFocus } from '../focus';
import * as primitives from '../primitives';
import { View } from './AddPropertyModal';

export interface IAddPropertyModalProps {
  focus: IClassFocus;
  isOpen: boolean;
  isPropertyNameAvailable: (name: string) => boolean;
  onAddProperty: (name: string, type: Realm.PropertyType | string) => void;
  classes: Realm.ObjectSchema[];
  toggle: () => void;
}

export interface IAddPropertyModalState {
  name: string;
  type: string;
  isList: boolean;
  optional: boolean;
  primitiveTypeSelected: boolean;
  nameIsValid: boolean;
  typeOptions: ITypeOption[];
}
export interface ITypeOption {
  value: string;
  disabled: boolean;
  show: boolean;
}

const initialState = {
  name: '',
  type: 'string',
  optional: false,
  nameIsValid: true,
  isList: false,
  primitiveTypeSelected: false,
};

class AddPropertyModalContainer extends React.Component<
  IAddPropertyModalProps,
  IAddPropertyModalState
> {
  public constructor(props: IAddPropertyModalProps) {
    super(props);
    this.state = {
      ...initialState,
      typeOptions: [],
    };
  }

  public componentWillReceiveProps() {
    this.generateTypeOptions();
  }

  public render() {
    return <View {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const type = this.getSchemaType();
    this.props.onAddProperty(this.state.name, type);
    this.props.toggle();
    this.setState(initialState);
  };

  public onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    this.setState({
      name: newValue,
      nameIsValid: this.props.isPropertyNameAvailable(newValue),
    });
  };

  public onTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    this.setState({
      type: newValue,
      primitiveTypeSelected: primitives.isPrimitive(newValue),
    });
  };

  public onOptionalChange = () => {
    this.setState({
      optional: !this.state.optional,
    });
  };

  public onIsListChange = () => {
    this.setState({
      isList: !this.state.isList,
    });
  };

  private generateTypeOptions = () => {
    const primitiveTypesHeader = {
      value: 'Primitive Types',
      disabled: true,
      show: true,
    };
    const primitiveTypesOptions = primitives.TYPES.map(type => ({
      value: type,
      disabled: false,
      show: true,
    }));
    const classes = this.getClassesTypes(this.props.classes);
    const classTypeHeader = {
      value: 'Link Types',
      disabled: true,
      show: classes.length > 0,
    };
    const classTypesOptions = classes.map(type => ({
      value: type,
      disabled: false,
      show: true,
    }));
    this.setState({
      typeOptions: [
        primitiveTypesHeader,
        ...primitiveTypesOptions,
        classTypeHeader,
        ...classTypesOptions,
      ],
    });
  };

  private getSchemaType = () => {
    const {
      type: propertyType,
      optional,
      isList,
      primitiveTypeSelected,
    } = this.state;
    const optionalMarker =
      optional && !(isList && !primitiveTypeSelected) ? '?' : '';
    const listMarker = isList ? '[]' : '';
    return `${propertyType}${optionalMarker}${listMarker}`;
  };

  private getClassesTypes = (classes: Realm.ObjectSchema[]): string[] =>
    classes.map(c => c.name);
}

export { AddPropertyModalContainer as AddPropertyModal };
