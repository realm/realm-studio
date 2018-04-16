import * as React from 'react';

import { IClassFocus } from '../focus';
import * as primitives from '../primitives';
import { View } from './AddPropertyModal';

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
  primitiveTypeSelected: boolean;
  nameIsValid: boolean;
  typeOptions: ITypeOption[];
}
export interface ITypeOption {
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
  primitiveTypeSelected: false,
};

export class AddPropertyModalContainer extends React.Component<
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
      primitiveTypeSelected: primitives.isPrimitive(newValue),
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
    const primitiveTypesHeader = {
      value: 'Primitive Types',
      disabled: true,
      show: true,
    };
    const primitiveTypesOptions = primitives.TYPES.map(type => ({
      value: type,
      disabled: false,
      show: true,
    }));
    const classes = this.getClassesTypes(this.props.schemas);
    const classTypeHeader = {
      value: 'Link Types',
      disabled: true,
      show: classes.length > 0,
    };
    const classTypesOptions = classes.map(type => ({
      value: type,
      disabled: false,
      show: true,
    }));
    this.setState({
      typeOptions: [
        primitiveTypesHeader,
        ...primitiveTypesOptions,
        classTypeHeader,
        ...classTypesOptions,
      ],
    });
  };

  private getSchemaProperty = () => {
    const {
      name,
      type: propertyType,
      optional,
      isList,
      primitiveTypeSelected,
    } = this.state;
    const optionalMarker =
      optional && !(isList && !primitiveTypeSelected) ? '?' : '';
    const listMarker = isList ? '[]' : '';
    return {
      [name]: `${propertyType}${optionalMarker}${listMarker}`,
    };
  };

  private getClassesTypes = (schemas: Realm.ObjectSchema[]): string[] =>
    schemas.map(schema => schema.name);
}
