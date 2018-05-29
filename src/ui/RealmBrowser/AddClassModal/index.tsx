import * as React from 'react';

import { AddClassModal } from './AddClassModal';

export interface IAddClassModalProps {
  isOpen: boolean;
  onAddClass: (schema: Realm.ObjectSchema) => void;
  toggle: () => void;
  isClassNameAvailable: (name: string) => boolean;
}

export interface IAddClassModalState {
  name: string;
  nameIsValid: boolean;
  primaryKey: boolean;
  primaryKeyName: string;
  primaryKeyType: string;
}

const initialState: IAddClassModalState = {
  name: '',
  nameIsValid: true,
  primaryKey: false,
  primaryKeyName: '',
  primaryKeyType: 'string',
};

class AddClassModalContainer extends React.Component<
  IAddClassModalProps,
  IAddClassModalState
> {
  public state = { ...initialState };

  public render() {
    return <AddClassModal {...this.props} {...this.state} {...this} />;
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

  public onPKChange = () => {
    this.setState({
      primaryKey: !this.state.primaryKey,
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

    return {
      name,
      ...(primaryKey ? { primaryKey: primaryKeyName } : {}),
      properties: {
        ...(primaryKey ? { [primaryKeyName]: primaryKeyType } : {}),
      },
    };
  };
}

export { AddClassModalContainer as AddClassModal };
