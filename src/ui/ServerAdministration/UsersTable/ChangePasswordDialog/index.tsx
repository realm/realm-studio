import * as React from 'react';

import { IUser } from '../../../../services/ros';

import { ChangePasswordDialog } from './ChangePasswordDialog';

export interface IChangePasswordDialogContainerProps {
  isOpen: boolean;
  onPasswordChanged: (userId: string, password: string) => void;
  onToggle: () => void;
  user?: IUser;
}

export interface IChangePasswordDialogContainerState {
  password: string;
  passwordRepeated: string;
}

class ChangePasswordDialogContainer extends React.Component<
  IChangePasswordDialogContainerProps,
  IChangePasswordDialogContainerState
> {
  public state: IChangePasswordDialogContainerState = {
    password: '',
    passwordRepeated: '',
  };

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
        this.props.onToggle();
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

export { ChangePasswordDialogContainer as ChangePasswordDialog };
