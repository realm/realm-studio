import * as React from 'react';

import { View } from './View';

export interface IAddClassModalProps {
  isOpen: boolean;
  onAddSchema: (name: string) => void;
  toggle: () => void;
  isClassNameAvailable: (name: string) => boolean;
}

export interface IAddClassModalState {
  name: string;
  nameIsValid: boolean;
}

export class AddClassModal extends React.Component<
  IAddClassModalProps,
  IAddClassModalState
> {
  public constructor() {
    super();
    this.state = {
      name: '',
      nameIsValid: true,
    };
  }

  public render() {
    return <View {...this.props} {...this.state} {...this} />;
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
      nameIsValid: this.props.isClassNameAvailable(newNameValue),
    });
  };
}
