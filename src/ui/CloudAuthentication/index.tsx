import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';
import { showError } from '../reusable/errors';

import { CloudAuthentication } from './CloudAuthentication';

const INTRODUCED_STORAGE_KEY = 'cloud-introduced';

export type Mode = 'introduction' | 'log-in' | 'sign-up';

interface ICloudAuthenticationContainerProps {
  message?: string;
}

interface ICloudAuthenticationContainerState {
  isLoading: boolean;
  mode: Mode;
}

class CloudAuthenticationContainer extends React.Component<
  ICloudAuthenticationContainerProps,
  ICloudAuthenticationContainerState
> {
  constructor() {
    super();
    const wasCloudIntroduced =
      localStorage.getItem(INTRODUCED_STORAGE_KEY) !== null;
    this.state = {
      isLoading: false,
      mode: wasCloudIntroduced ? 'log-in' : 'introduction',
    };
  }

  public render() {
    return (
      <CloudAuthentication
        isLoading={this.state.isLoading}
        message={this.props.message}
        mode={this.state.mode}
        onAuthenticateWithEmail={this.onAuthenticateWithEmail}
        onAuthenticateWithGitHub={this.onAuthenticateWithGitHub}
        onModeChange={this.onModeChange}
        onSignUp={this.onSignUp}
      />
    );
  }

  protected onAuthenticateWithEmail = async (
    email: string,
    password: string,
  ) => {
    this.setState({ isLoading: true });
    try {
      await main.authenticateWithEmail(email, password);
      this.setCloudIntroduced(true);
      // We could have closed not but it will get closed when the status updates
    } catch (err) {
      showError('Failed to authenticate with email', err);
      this.setState({ isLoading: false });
    }
  };

  protected onAuthenticateWithGitHub = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await main.authenticateWithGitHub();
      this.setCloudIntroduced(true);
      // We could have closed not but it will get closed when the status updates
    } catch (err) {
      showError('Failed to authenticate with GitHub', err);
      this.setState({ isLoading: false });
    }
  };

  protected onModeChange = (mode: Mode) => {
    this.setState({ mode });
  };

  protected onSignUp = async (email: string) => {
    this.setState({ isLoading: true });
    try {
      await raas.user.postEmailSignup(email);
      this.setState({ mode: 'waitlist' });
      this.setCloudIntroduced(true);
    } catch (err) {
      showError('Failed to sign up', err);
    }
    this.setState({ isLoading: false });
  };

  protected setCloudIntroduced(introduced: boolean) {
    if (introduced) {
      localStorage.setItem(INTRODUCED_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(INTRODUCED_STORAGE_KEY);
    }
  }
}

export { CloudAuthenticationContainer as CloudAuthentication };
