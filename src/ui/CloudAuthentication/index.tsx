import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';
import { showError } from '../reusable/errors';

import { CloudAuthentication } from './CloudAuthentication';

const INTRODUCED_STORAGE_KEY = 'cloud-introduced';

export type Mode = 'introduction' | 'log-in' | 'sign-up' | 'waitlist';

interface ICloudAuthenticationContainerState {
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
    this.setState({ isLoading: true });
    try {
      await main.authenticateWithEmail(email, password);
      this.setCloudIntroduced(true);
      // Close this window ..
      window.close();
    } catch (err) {
      showError('Failed to authenticate with email', err);
    }
    this.setState({ isLoading: false });
  };

  protected onAuthenticateWithGitHub = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await main.authenticateWithGitHub();
      this.setCloudIntroduced(true);
      if (!response.canCreate) {
        this.setState({ mode: 'waitlist' });
        // Focus the window to show the waitlist message
        window.focus();
      } else {
        // Close this window ..
        window.close();
      }
    } catch (err) {
      showError('Failed to authenticate with GitHub', err);
    }
    this.setState({ isLoading: false });
  };

  protected onModeChange = (mode: Mode) => {
    this.setState({ mode });
  };

  protected onSignUp = async (email: string) => {
    /*
    this.setState({ isLoading: true });
    try {
      await raas.user.postEmailSignup(email);
      this.setState({ mode: 'waitlist' });
      this.setCloudIntroduced(true);
    } catch (err) {
      showError('Failed to sign up', err);
    }
    this.setState({ isLoading: false });
    */
    // TODO: Re-enable this once the recaptcha is added
    const baseUrl = raas.getEndpoint();
    electron.shell.openExternal(`${baseUrl}/login/sign-up`);
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
