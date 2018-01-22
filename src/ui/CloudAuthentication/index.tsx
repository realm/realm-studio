import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';

import { CloudAuthentication } from './CloudAuthentication';

interface ICloudAuthenticationContainerState {
  email: string;
  error?: Error;
  isLoading: boolean;
  password: string;
}

class CloudAuthenticationContainer extends React.Component<
  {},
  ICloudAuthenticationContainerState
> {
  constructor() {
    super();
    this.state = {
      email: '',
      isLoading: false,
      password: '',
    };
  }

  public render() {
    return (
      <CloudAuthentication
        email={this.state.email}
        error={this.state.error}
        isLoading={this.state.isLoading}
        onAuthenticateWithEmail={this.onAuthenticateWithEmail}
        onAuthenticateWithGitHub={this.onAuthenticateWithGitHub}
        onEmailChange={this.onEmailChange}
        onPasswordChange={this.onPasswordChange}
        password={this.state.password}
      />
    );
  }

  protected onAuthenticateWithEmail = async () => {
    try {
      this.setState({ isLoading: true, error: undefined });
      await main.authenticateWithEmail(this.state.email, this.state.password);
      this.setState({ isLoading: false });
      // Close this window ..
      window.close();
    } catch (err) {
      this.setState({ error: err, isLoading: false });
    }
  };

  protected onAuthenticateWithGitHub = async () => {
    try {
      this.setState({ isLoading: true, error: undefined });
      await main.authenticateWithGitHub();
      this.setState({ isLoading: false });
      // Close this window ..
      window.close();
    } catch (err) {
      this.setState({ error: err, isLoading: false });
    }
  };

  protected onEmailChange = (email: string) => {
    this.setState({ email });
  };

  protected onPasswordChange = (password: string) => {
    this.setState({ password });
  };
}

export { CloudAuthenticationContainer as CloudAuthentication };
