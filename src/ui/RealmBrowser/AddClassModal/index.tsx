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

import { AddClassModal } from './AddClassModal';

export interface IAddClassModalProps {
  isOpen: boolean;
  onAddClass: (schema: Realm.ObjectSchema) => void;
  toggle: () => void;
  isClassNameAvailable: (name: string) => boolean;
}

export interface IAddClassModalState {
  name: string;
  nameIsValid: boolean;
  primaryKey: boolean;
  primaryKeyName: string;
  primaryKeyType: string;
}

const initialState: IAddClassModalState = {
  name: '',
  nameIsValid: true,
  primaryKey: false,
  primaryKeyName: '',
  primaryKeyType: 'string',
};

class AddClassModalContainer extends React.Component<
  IAddClassModalProps,
  IAddClassModalState
> {
  public state = { ...initialState };

  public render() {
    return <AddClassModal {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.onAddClass(this.getSchema());
    this.props.toggle();
    this.setState(initialState);
  };

  public onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNameValue = e.target.value;
    this.setState({
      name: newNameValue,
      nameIsValid: this.props.isClassNameAvailable(newNameValue),
    });
  };

  public onPKChange = () => {
    this.setState({
      primaryKey: !this.state.primaryKey,
    });
  };

  public onPKNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      primaryKeyName: e.target.value,
    });
  };

  public onPKTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      primaryKeyType: e.target.value,
    });
  };

  private preparePrimaryKeyName = (primaryKeyName: string) =>
    primaryKeyName === '' ? 'uuid' : primaryKeyName;

  private getSchema = (): Realm.ObjectSchema => {
    const { name, primaryKey, primaryKeyType } = this.state;
    const primaryKeyName = this.preparePrimaryKeyName(
      this.state.primaryKeyName,
    );

    return {
      name,
      ...(primaryKey ? { primaryKey: primaryKeyName } : {}),
      properties: {
        ...(primaryKey ? { [primaryKeyName]: primaryKeyType } : {}),
      },
    };
  };
}

export { AddClassModalContainer as AddClassModal };
