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
import Realm from 'realm';
import { ObjectId } from 'bson';

import { CreateObjectHandler } from '..';
import { showError } from '../../../reusable/errors';
import { IClassFocus } from '../../focus';

import {
  CreateObjectDialog,
  ICreateObjectDialogProps,
} from './CreateObjectDialog';

import './CreateObjectDialog.scss';

interface IRealmObject {
  [propertyName: string]: any;
}

interface IClosedCreateObjectDialogContainerProps {
  isOpen: false;
}

interface IOpenCreateObjectDialogContainerProps {
  getClassFocus: (className: string) => IClassFocus;
  isOpen: true;
  onCancel: () => void;
  onCreate: CreateObjectHandler;
  schema: Realm.ObjectSchema;
}

export interface ICreateObjectDialogContainerState {
  values: IRealmObject;
}

export type ICreateObjectDialogContainerProps =
  | IClosedCreateObjectDialogContainerProps
  | IOpenCreateObjectDialogContainerProps;

class CreateObjectDialogContainer extends React.PureComponent<
  ICreateObjectDialogContainerProps,
  ICreateObjectDialogContainerState
> {
  private static generateInitialValues(
    props: ICreateObjectDialogContainerProps,
  ) {
    if (props.isOpen) {
      const properties = props.schema.properties;
      const primaryKey = props.schema.primaryKey;
      const values: IRealmObject = {};
      Object.keys(properties).forEach(propertyName => {
        const property = properties[propertyName] as Realm.ObjectSchemaProperty;
        values[propertyName] = CreateObjectDialogContainer.generateInitialValue(
          property,
          propertyName,
          primaryKey,
        );
      });
      return values;
    } else {
      return {};
    }
  }

  private static generateInitialValue(
    property: Realm.ObjectSchemaProperty,
    propertyName?: string,
    primaryKey?: string,
  ) {
    // TODO: Initialize the values based on their property
    if (
      propertyName === '_id' &&
      propertyName === primaryKey &&
      property.type === 'object id'
    ) {
      return new ObjectId();
    } else if (property.type === 'list') {
      // If a list is optional, it refers to the type of the elements
      return [];
    } else if (property.optional) {
      return null;
    } else if (property.type === 'object id') {
      return new ObjectId();
    } else if (
      property.type === 'int' ||
      property.type === 'float' ||
      property.type === 'double'
    ) {
      return 0;
    } else if (property.type === 'string') {
      return '';
    } else if (property.type === 'bool') {
      return false;
    } else if (property.type === 'date') {
      return new Date();
    } else if (property.type === 'data') {
      return new Buffer('');
    } else {
      // Best guess is null - even with if required
      return null;
    }
  }

  public state: ICreateObjectDialogContainerState = {
    values: {},
  };

  public componentDidMount() {
    const values = CreateObjectDialogContainer.generateInitialValues(
      this.props,
    );
    this.setState({ values });
  }

  public componentWillReceiveProps(
    nextProps: ICreateObjectDialogContainerProps,
  ) {
    if (
      nextProps.isOpen &&
      (!this.props.isOpen || this.props.schema !== nextProps.schema)
    ) {
      const values = CreateObjectDialogContainer.generateInitialValues(
        nextProps,
      );
      this.setState({ values });
    }
  }

  public render() {
    const props = this.getProps();
    return <CreateObjectDialog {...props} />;
  }

  protected getProps(): ICreateObjectDialogProps {
    const common = {
      generateInitialValue: CreateObjectDialogContainer.generateInitialValue,
      onCancel: this.onCancel,
      onCreate: this.onCreate,
      onValueChange: this.onValueChange,
      values: this.state.values,
    };
    if (this.props.isOpen) {
      return {
        ...common,
        isOpen: true,
        getClassFocus: this.props.getClassFocus,
        schema: this.props.schema,
      };
    } else {
      return {
        ...common,
        isOpen: false,
      };
    }
  }

  protected onCancel = () => {
    if (this.props.isOpen) {
      this.props.onCancel();
    }
  };

  protected onCreate = () => {
    if (this.props.isOpen) {
      try {
        this.props.onCreate(this.props.schema.name, this.state.values);
      } catch (err) {
        const className = this.props.schema.name;
        showError(`Couldn't create the ${className}:\n\n${err.message}`, err);
      }
    } else {
      throw new Error('Expected a schema');
    }
  };

  protected onValueChange = (propertyName: string, value: any) => {
    this.setState({
      values: {
        ...this.state.values,
        [propertyName]: value,
      },
    });
  };
}

export { CreateObjectDialogContainer as CreateObjectDialog };
