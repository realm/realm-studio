////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import React from 'react';

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
