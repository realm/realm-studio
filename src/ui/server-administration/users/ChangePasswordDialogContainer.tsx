import * as React from 'react';

import { IUser } from '../../../services/ros';

import { ChangePasswordDialog } from './ChangePasswordDialog';

export interface IChangePasswordDialogContainerProps {
  isOpen: boolean;
  onPasswordChanged: (userId: string, password: string) => void;
  toggle: () => void;
  user: IUser | null;
}

export interface IChangePasswordDialogContainerState {
  password: string;
  passwordRepeated: string;
}

export class ChangePasswordDialogContainer extends React.Component<
  IChangePasswordDialogContainerProps,
  IChangePasswordDialogContainerState
> {
  public constructor() {
    super();
    this.state = {
      password: '',
      passwordRepeated: '',
    };
  }

  public render() {
    const user = this.props.user;
    return user ? (
      <ChangePasswordDialog
        {...this.props}
        {...this.state}
        {...this}
        user={user}
      />
    ) : null;
  }

  public onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.props.user) {
      const { password, passwordRepeated } = this.state;
      if (password === passwordRepeated) {
        this.setState({
          password: '',
          passwordRepeated: '',
        });
        this.props.toggle();
        this.props.onPasswordChanged(this.props.user.userId, password);
      }
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
}
