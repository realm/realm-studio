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
  typeOptions: ITypeOption[];
}
export interface ITypeOption {
  key: number;
  value: string;
  disabled: boolean;
  show: boolean;
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
  public constructor(props: IAddPropertyModalProps) {
    super(props);
    this.state = {
      ...initialState,
      typeOptions: [],
    };
  }

  public componentWillReceiveProps(props: IAddPropertyModalProps) {
    this.generateTypeOptions();
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

  private generateTypeOptions = () => {
    const primitiveHeader = {
      key: 0,
      value: 'Primitive types',
      disabled: true,
      show: true,
    };
    const primitiveTypesOptions = TYPES.map((type, index) => ({
      key: index + 1,
      value: type,
      disabled: false,
      show: true,
    }));
    const classes = this.getClassesTypes(this.props.schemas);
    const classesHeader = {
      key: primitiveTypesOptions.length + 1,
      value: 'Class types',
      disabled: true,
      show: classes.length > 0,
    };
    const classesTypesOptions = classes.map((type, index) => ({
      key: primitiveTypesOptions.length + index + 2,
      value: type,
      disabled: false,
      show: true,
    }));
    this.setState({
      typeOptions: [
        primitiveHeader,
        ...primitiveTypesOptions,
        classesHeader,
        ...classesTypesOptions,
      ],
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
