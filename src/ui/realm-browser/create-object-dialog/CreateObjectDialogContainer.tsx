import * as React from 'react';
import * as Realm from 'realm';

import { CreateObjectHandler } from '..';
import { CreateObjectDialog } from './CreateObjectDialog';

export interface ICreateObjectDialogContainerProps {
  schema?: Realm.ObjectSchema;
  isOpen: boolean;
  onCreate: CreateObjectHandler;
  toggle: () => void;
}

export interface ICreateObjectDialogContainerState {
  values: { [propertyName: string]: any };
}

export class CreateObjectDialogContainer extends React.PureComponent<
  ICreateObjectDialogContainerProps,
  ICreateObjectDialogContainerState
> {
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

  protected onCreate = () => {
    if (this.props.schema) {
      this.props.onCreate(this.props.schema.name, this.state.values);
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
