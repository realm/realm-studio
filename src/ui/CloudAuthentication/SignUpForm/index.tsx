import * as React from 'react';
import { Card } from 'reactstrap';

import * as raas from '../../../services/raas';

import { Mode } from '..';
import { SignUpForm } from './SignUpForm';

interface ISignUpFormProps {
  className?: string;
  error?: Error;
  onAuthenticateWithGitHub: () => void;
  onSignUp: (email: string) => void;
  onModeChange: (mode: Mode) => void;
}

interface ISignUpFormState {
  email: string;
  error?: Error;
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
        error={this.props.error || this.state.error}
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
    try {
      this.setState({ error: undefined });
      /*
      const user = await raas.postEmailSignup({
        email: this.state.email,
      });
      */
      this.props.onSignUp(this.state.email);
    } catch (err) {
      this.setState({ error: err });
    }
  };
}

export { SignUpFormContainer as SignUpForm };
