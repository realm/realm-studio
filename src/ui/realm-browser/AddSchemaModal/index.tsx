import * as React from 'react';

import { SchemaModal } from './SchemaModal';

export interface IAddSchemaModalProps {
  isOpen: boolean;
  onAddSchema: (name: string) => void;
  toggle: () => void;
}

export interface IAddSchemaModalState {
  name: string;
}

export class AddSchemaModal extends React.Component<
  IAddSchemaModalProps,
  IAddSchemaModalState
> {
  public constructor() {
    super();
    this.state = {
      name: '',
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
    this.setState({
      name: e.target.value,
    });
  };
}
