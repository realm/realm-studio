import * as React from 'react';

import { IUser } from '../../../services/ros';

import { CreateUserDialog } from './CreateUserDialog';

export interface ICreateUserDialogContainerProps {
  isOpen: boolean;
  onUserCreated: (username: string, password: string) => void;
  toggle: () => void;
}

export interface ICreateUserDialogContainerState {
  password: string;
  passwordRepeated: string;
  username: string;
}

export class CreateUserDialogContainer extends React.Component<
  ICreateUserDialogContainerProps,
  ICreateUserDialogContainerState
> {
  public constructor() {
    super();
    this.state = {
      password: '',
      passwordRepeated: '',
      username: '',
    };
  }

  public render() {
    return <CreateUserDialog {...this.props} {...this.state} {...this} />;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { password, passwordRepeated, username } = this.state;
    if (password === passwordRepeated) {
      this.setState({
        password: '',
        passwordRepeated: '',
        username: '',
      });
      this.props.toggle();
      this.props.onUserCreated(username, password);
    }
  };

  public onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  public onPasswordRepeatedChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({
      passwordRepeated: e.target.value,
    });
  };

  public onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: e.target.value,
    });
  };
}
