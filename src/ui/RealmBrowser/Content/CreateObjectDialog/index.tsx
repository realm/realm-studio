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
import { v4 as uuid } from 'uuid';

import { CreateObjectHandler, EmbeddedInfo } from '..';
import { showError } from '../../../reusable/errors';
import { IClassFocus } from '../../focus';

import {
  CreateObjectDialog,
  ICreateObjectDialogProps,
} from './CreateObjectDialog';

import './CreateObjectDialog.scss';
import { IsEmbeddedTypeChecker, JsonViewerDialogExecutor } from '../..';

const { ObjectId, UUID, Decimal128 } = Realm.BSON;

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
  isEmbeddedType: IsEmbeddedTypeChecker;
  embeddedInfo?: EmbeddedInfo;
  onShowJsonViewerDialog: JsonViewerDialogExecutor;
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
    if (propertyName === primaryKey) {
      // Special handling for primary keys. Opting out of optional handling & return a random value.
      if (property.type === 'objectId') {
        return new ObjectId();
      } else if (property.type === 'uuid') {
        return new UUID();
      } else if (propertyName === 'uuid' && property.type === 'string') {
        return uuid();
      }
    }

    if (property.type === 'list') {
      // If a list is optional, it refers to the type of the elements
      return [];
    } else if (property.optional) {
      return null;
    } else if (property.type === 'objectId') {
      return new ObjectId();
    } else if (property.type === 'uuid') {
      return new UUID();
    } else if (
      property.type === 'int' ||
      property.type === 'float' ||
      property.type === 'double'
    ) {
      return 0;
    } else if (property.type === 'decimal128') {
      return Decimal128.fromString('0');
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
      const values =
        CreateObjectDialogContainer.generateInitialValues(nextProps);
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
      isEmbeddedType: this.isEmbeddedType,
    };
    if (this.props.isOpen) {
      return {
        ...common,
        isOpen: true,
        getClassFocus: this.props.getClassFocus,
        schema: this.props.schema,
        onShowJsonViewerDialog: this.props.onShowJsonViewerDialog,
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
        this.props.onCreate(
          this.props.schema.name,
          this.state.values,
          this.props.embeddedInfo,
        );
      } catch (err) {
        const className = this.props.schema.name;
        const message = err instanceof Error ? err.message : String(err);
        showError(`Couldn't create the ${className}:\n\n${message}`, err);
      }
    } else {
      throw new Error('Expected a schema');
    }
  };

  protected isEmbeddedType: IsEmbeddedTypeChecker = (className?: string) =>
    this.props.isOpen && this.props.isEmbeddedType(className);

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
