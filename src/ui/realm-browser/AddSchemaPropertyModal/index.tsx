import * as React from 'react';

import { View } from './View';

export interface IAddSchemaPropertyModalProps {
  isOpen: boolean;
  onAddSchemaProperty: (property: Realm.PropertiesTypes) => void;
  toggle: () => void;
  isPropertyNameAvailable: (name: string) => boolean;
  propertyTypeOptions: string[];
}

export interface IAddSchemaPropertyModalState {
  name: string;
  nameIsValid: boolean;
  type: string;
  optional: boolean;
}

const initialState = {
  name: '',
  nameIsValid: true,
  type: 'string',
  optional: false,
};

export class AddSchemaPropertyModal extends React.Component<
  IAddSchemaPropertyModalProps,
  IAddSchemaPropertyModalState
> {
  public constructor() {
    super();
    this.state = {
      ...initialState,
    };
  }

  public render() {
    return <View {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, type, optional } = this.state;
    this.setState(initialState);
    this.props.toggle();
    this.props.onAddSchemaProperty({
      [name]: {
        type,
        optional,
      },
    });
  };

  public onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    this.setState({
      name: newValue,
      nameIsValid: this.props.isPropertyNameAvailable(newValue),
    });
  };

  public onTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    this.setState({
      type: newValue,
    });
  };

  public onOptionalChange = () => {
    this.setState({
      optional: !this.state.optional,
    });
  };
}
