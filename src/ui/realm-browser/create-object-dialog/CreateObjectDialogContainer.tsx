import * as React from 'react';
import * as Realm from 'realm';

import { CreateObjectHandler } from '..';
import { parse } from '../parsers';
import { CreateObjectDialog } from './CreateObjectDialog';

import './CreateObjectDialog.scss';

interface IRealmObject {
  [propertyName: string]: any;
}

export interface ICreateObjectDialogContainerProps {
  schema?: Realm.ObjectSchema;
  isOpen: boolean;
  onCreate: CreateObjectHandler;
  toggle: () => void;
}

export interface ICreateObjectDialogContainerState {
  values: IRealmObject;
}

export class CreateObjectDialogContainer extends React.PureComponent<
  ICreateObjectDialogContainerProps,
  ICreateObjectDialogContainerState
> {
  constructor() {
    super();
    this.state = {
      values: {},
    };
  }

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
      const values: IRealmObject = {};
      Object.keys(properties).forEach(propertyName => {
        const property = properties[propertyName] as Realm.ObjectSchemaProperty;
        values[propertyName] = this.generateInitialValue(property);
      });
      this.setState({
        values,
      });
    }
  }

  protected generateInitialValue(property: Realm.ObjectSchemaProperty) {
    // TODO: Initialize the values based on their property
    return property.type === 'string' ? '' : null;
  }

  protected onCreate = () => {
    if (this.props.schema) {
      this.props.onCreate(this.props.schema.name, this.state.values);
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
