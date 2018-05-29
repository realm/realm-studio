import * as React from 'react';

import { CreateUserDialog } from './CreateUserDialog';

export interface ICreateUserDialogContainerProps {
  isOpen: boolean;
  onUserCreated: (username: string, password: string) => void;
  onToggle: () => void;
}

export interface ICreateUserDialogContainerState {
  password: string;
  passwordRepeated: string;
  username: string;
}

const initialState: ICreateUserDialogContainerState = {
  password: '',
  passwordRepeated: '',
  username: '',
};

class CreateUserDialogContainer extends React.Component<
  ICreateUserDialogContainerProps,
  ICreateUserDialogContainerState
> {
  public state: ICreateUserDialogContainerState = { ...initialState };

  public render() {
    return (
      <CreateUserDialog
        isOpen={this.props.isOpen}
        onToggle={this.onToggle}
        {...this.state}
        {...this}
      />
    );
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
      this.props.onToggle();
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

  protected onToggle = () => {
    this.setState({ ...initialState });
    this.props.onToggle();
  };
}

export { CreateUserDialogContainer as CreateUserDialog };
