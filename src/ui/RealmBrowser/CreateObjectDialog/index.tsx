import * as React from 'react';
import * as Realm from 'realm';
import { v4 as uuid } from 'uuid';

import { CreateObjectHandler } from '..';
import { showError } from '../../reusable/errors';
import { IClassFocus } from '../focus';
import { CreateObjectDialog } from './CreateObjectDialog';

import './CreateObjectDialog.scss';

interface IRealmObject {
  [propertyName: string]: any;
}

export interface ICreateObjectDialogContainerProps {
  isOpen: boolean;
  onCreate: CreateObjectHandler;
  getClassFocus: (className: string) => IClassFocus;
  schema?: Realm.ObjectSchema;
  toggle: () => void;
}

export interface ICreateObjectDialogContainerState {
  values: IRealmObject;
}

class CreateObjectDialogContainer extends React.PureComponent<
  ICreateObjectDialogContainerProps,
  ICreateObjectDialogContainerState
> {
  public state: ICreateObjectDialogContainerState = {
    values: {},
  };

  public componentDidMount() {
    this.generateInitialValues(this.props);
  }

  public componentWillReceiveProps(
    nextProps: ICreateObjectDialogContainerProps,
  ) {
    if (this.props.schema !== nextProps.schema) {
      this.generateInitialValues(nextProps);
    }
  }

  public render() {
    return (
      <CreateObjectDialog
        generateInitialValue={this.generateInitialValue}
        getClassFocus={this.props.getClassFocus}
        isOpen={this.props.isOpen}
        onCreate={this.onCreate}
        onValueChange={this.onValueChange}
        schema={this.props.schema}
        toggle={this.props.toggle}
        values={this.state.values}
      />
    );
  }

  protected generateInitialValues(props: ICreateObjectDialogContainerProps) {
    if (props.schema) {
      const properties = props.schema.properties;
      const primaryKey = props.schema.primaryKey;
      const values: IRealmObject = {};
      Object.keys(properties).forEach(propertyName => {
        const property = properties[propertyName] as Realm.ObjectSchemaProperty;
        values[propertyName] = this.generateInitialValue(
          property,
          propertyName,
          primaryKey,
        );
      });
      this.setState({
        values,
      });
    }
  }

  protected generateInitialValue = (
    property: Realm.ObjectSchemaProperty,
    propertyName?: string,
    primaryKey?: string,
  ) => {
    // TODO: Initialize the values based on their property
    if (
      propertyName === 'uuid' &&
      propertyName === primaryKey &&
      property.type === 'string'
    ) {
      return uuid();
    } else if (property.type === 'list') {
      // If a list is optional, it refers to the type of the elements
      return [];
    } else if (property.optional) {
      return null;
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
  };

  protected onCreate = () => {
    if (this.props.schema) {
      try {
        this.props.onCreate(this.props.schema.name, this.state.values);
        this.props.toggle();
      } catch (err) {
        const className = this.props.schema.name;
        showError(`Couldn't create the ${className}:\n\n${err.message}`, err);
      }
    } else {
      throw new Error('Expected a schema');
    }
  };

  protected onValueChange = (propertyName: string, value: any) => {
    if (this.props.schema) {
      this.setState({
        values: {
          ...this.state.values,
          [propertyName]: value,
        },
      });
    }
  };
}

export { CreateObjectDialogContainer as CreateObjectDialog };
