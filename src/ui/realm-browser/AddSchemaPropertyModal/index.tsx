import * as React from 'react';

import { View } from './View';

export interface IAddSchemaPropertyModalProps {
  isOpen: boolean;
  onAddSchemaProperty: (name: string) => void;
  toggle: () => void;
  isPropertyNameAvailable: (name: string) => boolean;
}

export interface IAddSchemaPropertyModalState {
  propertyName: string;
  propertyNameIsValid: boolean;
}

export class AddSchemaPropertyModal extends React.Component<
  IAddSchemaPropertyModalProps,
  IAddSchemaPropertyModalState
> {
  public constructor() {
    super();
    this.state = {
      propertyName: '',
      propertyNameIsValid: true,
    };
  }

  public render() {
    return <View {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { propertyName } = this.state;
    this.setState({
      propertyName: '',
    });
    this.props.toggle();
    this.props.onAddSchemaProperty(propertyName);
  };

  public onPropertyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPropertyNameValue = e.target.value;
    this.setState({
      propertyName: newPropertyNameValue,
      propertyNameIsValid: this.props.isPropertyNameAvailable(
        newPropertyNameValue,
      ),
    });
  };
}
