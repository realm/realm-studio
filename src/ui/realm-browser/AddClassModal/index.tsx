import * as React from 'react';

import { View } from './View';

export const PRIMARY_KEY_OPTIONS = {
  none: {
    key: 'none',
    label: 'None',
  },
  custom: {
    key: 'custom',
    label: 'Customized',
  },
};

export interface IAddClassModalProps {
  isOpen: boolean;
  onAddClass: (schema: Realm.ObjectSchema) => void;
  toggle: () => void;
  isClassNameAvailable: (name: string) => boolean;
}

export interface IAddClassModalState {
  name: string;
  nameIsValid: boolean;
  primaryKey: string;
  primaryKeyName: string;
  primaryKeyType: string;
}

const initialState = {
  name: '',
  nameIsValid: true,
  primaryKey: PRIMARY_KEY_OPTIONS.none.key,
  primaryKeyName: '',
  primaryKeyType: 'string',
};

export class AddClassModal extends React.Component<
  IAddClassModalProps,
  IAddClassModalState
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
    this.props.onAddClass(this.getSchema());
    this.props.toggle();
    this.setState(initialState);
  };

  public onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNameValue = e.target.value;
    this.setState({
      name: newNameValue,
      nameIsValid: this.props.isClassNameAvailable(newNameValue),
    });
  };

  public onPKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      primaryKey: e.target.value,
    });
  };

  public onPKNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      primaryKeyName: e.target.value,
    });
  };

  public onPKTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      primaryKeyType: e.target.value,
    });
  };

  private preparePrimaryKeyName = (primaryKeyName: string) =>
    primaryKeyName === '' ? 'uuid' : primaryKeyName;

  private getSchema = (): Realm.ObjectSchema => {
    const { name, primaryKey, primaryKeyType } = this.state;
    const primaryKeyName = this.preparePrimaryKeyName(
      this.state.primaryKeyName,
    );
    const hasPrimaryKey = primaryKey !== PRIMARY_KEY_OPTIONS.none.key;

    return {
      name,
      ...hasPrimaryKey ? { primaryKey: primaryKeyName } : {},
      properties: {
        ...hasPrimaryKey ? { [primaryKeyName]: primaryKeyType } : {},
      },
    };
  };
}
