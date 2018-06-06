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
import { Card } from 'reactstrap';

import * as raas from '../../../services/raas';

import { Mode } from '..';
import { SignUpForm } from './SignUpForm';

interface ISignUpFormProps {
  className?: string;
  onAuthenticateWithGitHub: () => void;
  onSignUp: (email: string, password: string) => void;
  onModeChange: (mode: Mode) => void;
}

interface ISignUpFormState {
  email: string;
  password: string;
}

export class SignUpFormContainer extends React.Component<
  ISignUpFormProps,
  ISignUpFormState
> {
  constructor(props: ISignUpFormProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  public render() {
    return (
      <SignUpForm
        className={this.props.className}
        email={this.state.email}
        onAuthenticateWithGitHub={this.props.onAuthenticateWithGitHub}
        onEmailChange={this.onEmailChange}
        onEmailSubmit={this.onEmailSubmit}
        onModeChange={this.props.onModeChange}
        onPasswordChange={this.onPasswordChange}
        password={this.state.password}
      />
    );
  }

  public onEmailChange = (email: string) => {
    this.setState({ email });
  };

  public onPasswordChange = (password: string) => {
    this.setState({ password });
  };

  public onEmailSubmit = async () => {
    this.props.onSignUp(this.state.email, this.state.password);
  };
}

export { SignUpFormContainer as SignUpForm };
