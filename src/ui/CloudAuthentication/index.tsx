import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';

import { CloudAuthentication } from './CloudAuthentication';

const INTRODUCED_STORAGE_KEY = 'cloud-introduced';

export type Mode = 'introduction' | 'log-in' | 'sign-up' | 'waitlist';

interface ICloudAuthenticationContainerState {
  error?: Error;
  isLoading: boolean;
  mode: Mode;
}

class CloudAuthenticationContainer extends React.Component<
  {},
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
        error={this.state.error}
        isLoading={this.state.isLoading}
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
    try {
      this.setState({ isLoading: true, error: undefined });
      await main.authenticateWithEmail(email, password);
      this.setState({ isLoading: false });
      this.setCloudIntroduced(true);
      // Close this window ..
      window.close();
    } catch (err) {
      this.setState({ error: err, isLoading: false });
    }
  };

  protected onAuthenticateWithGitHub = async () => {
    try {
      this.setState({ isLoading: true, error: undefined });
      const response = await main.authenticateWithGitHub();
      this.setCloudIntroduced(true);
      if (!response.canCreate) {
        this.setState({ isLoading: false, mode: 'waitlist' });
        // Focus the window to show the waitlist message
        window.focus();
      } else {
        this.setState({ isLoading: false });
        // Close this window ..
        window.close();
      }
    } catch (err) {
      this.setState({ error: err, isLoading: false });
    }
  };

  protected onModeChange = (mode: Mode) => {
    this.setState({ mode });
  };

  protected onSignUp = async (email: string) => {
    try {
      this.setState({ isLoading: true, error: undefined });
      await raas.user.postEmailSignup(email);
      this.setState({ isLoading: false, mode: 'waitlist' });
      this.setCloudIntroduced(true);
    } catch (err) {
      this.setState({ error: err, isLoading: false });
    }
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
