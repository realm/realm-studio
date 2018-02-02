import * as React from 'react';
import { Card } from 'reactstrap';

import * as raas from '../../../services/raas';

import { Mode } from '..';
import { SignUpForm } from './SignUpForm';

interface ISignUpFormProps {
  className?: string;
  onAuthenticateWithGitHub: () => void;
  onSignUp: (email: string) => void;
  onModeChange: (mode: Mode) => void;
}

interface ISignUpFormState {
  email: string;
}

export class SignUpFormContainer extends React.Component<
  ISignUpFormProps,
  ISignUpFormState
> {
  constructor(props: ISignUpFormProps) {
    super(props);
    this.state = {
      email: '',
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
      />
    );
  }

  public onEmailChange = (email: string) => {
    this.setState({ email });
  };

  public onEmailSubmit = async () => {
    this.props.onSignUp(this.state.email);
  };
}

export { SignUpFormContainer as SignUpForm };
