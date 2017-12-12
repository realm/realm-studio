import * as React from 'react';

import { IClassFocus } from '../focus';
import { TYPES } from '../primitives';
import { View } from './View';

export interface IAddPropertyModalProps {
  focus: IClassFocus;
  isOpen: boolean;
  isPropertyNameAvailable: (name: string) => boolean;
  onAddProperty: (property: Realm.PropertiesTypes) => void;
  schemas: Realm.ObjectSchema[];
  toggle: () => void;
}

export interface IAddPropertyModalState {
  name: string;
  type: string;
  isList: boolean;
  optional: boolean;
  nameIsValid: boolean;
  typeOptions: string[];
}

const initialState = {
  name: '',
  type: 'string',
  optional: false,
  nameIsValid: true,
  isList: false,
};

export class AddPropertyModal extends React.Component<
  IAddPropertyModalProps,
  IAddPropertyModalState
> {
  public constructor() {
    super();
    this.state = {
      ...initialState,
      typeOptions: TYPES,
    };
  }

  public componentWillReceiveProps(props: IAddPropertyModalProps) {
    this.setState({
      typeOptions: [...TYPES, ...this.getClassesTypes(props.schemas)],
    });
  }

  public render() {
    return <View {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.onAddProperty(this.getSchemaProperty());
    this.props.toggle();
    this.setState(initialState);
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

  public onIsListChange = () => {
    this.setState({
      isList: !this.state.isList,
    });
  };

  private getSchemaProperty = () => {
    const { name, type: propertyType, optional, isList } = this.state;
    return {
      [name]: `${propertyType}${optional ? '?' : ''}${isList ? '[]' : ''}`,
    };
  };

  private getClassesTypes = (schemas: Realm.ObjectSchema[]): string[] =>
    schemas.map(schema => schema.name);
}
