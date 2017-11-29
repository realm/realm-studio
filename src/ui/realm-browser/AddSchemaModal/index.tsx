import * as React from 'react';

import { SchemaModal } from './SchemaModal';

export interface IAddSchemaModalProps {
  isOpen: boolean;
  onAddSchema: (name: string) => void;
  toggle: () => void;
  isSchemaNameAvailable: (name: string) => boolean;
}

export interface IAddSchemaModalState {
  name: string;
  nameIsValid: boolean;
}

export class AddSchemaModal extends React.Component<
  IAddSchemaModalProps,
  IAddSchemaModalState
> {
  public constructor() {
    super();
    this.state = {
      name: '',
      nameIsValid: true,
    };
  }

  public render() {
    return <SchemaModal {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name } = this.state;
    this.setState({
      name: '',
    });
    this.props.toggle();
    this.props.onAddSchema(name);
  };

  public onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNameValue = e.target.value;
    this.setState({
      name: newNameValue,
      nameIsValid: this.props.isSchemaNameAvailable(newNameValue),
    });
  };
}
