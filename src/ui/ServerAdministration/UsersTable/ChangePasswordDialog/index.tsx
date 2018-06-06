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
