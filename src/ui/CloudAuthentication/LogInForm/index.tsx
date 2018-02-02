import * as React from 'react';
import { Card } from 'reactstrap';

import * as raas from '../../../services/raas';

import { Mode } from '..';
import { LogInForm } from './LogInForm';

interface ILogInFormProps {
  className?: string;
  onAuthenticateWithEmail: (email: string, password: string) => void;
  onAuthenticateWithGitHub: () => void;
  onModeChange: (mode: Mode) => void;
}

interface ILogInFormState {
  email: string;
  password: string;
}

export class LogInFormContainer extends React.Component<
  ILogInFormProps,
  ILogInFormState
> {
  constructor(props: ILogInFormProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  public render() {
    return (
      <LogInForm
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
    this.props.onAuthenticateWithEmail(this.state.email, this.state.password);
  };
}

export { LogInFormContainer as LogInForm };
