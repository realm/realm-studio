import * as electron from 'electron';
import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';
import { showError } from '../reusable/errors';

import { CloudAuthentication } from './CloudAuthentication';

const INTRODUCED_STORAGE_KEY = 'cloud-introduced';

export type Mode = 'introduction' | 'log-in' | 'sign-up' | 'verify-email';
export type Status =
  | 'idle'
  | 'authenticating'
  | 'signing-up'
  | 'awaiting-github';

interface ICloudAuthenticationContainerProps {
  message?: string;
}

interface ICloudAuthenticationContainerState {
  status: Status;
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
      status: 'idle',
      mode: wasCloudIntroduced ? 'log-in' : 'introduction',
    };
  }

  public render() {
    return (
      <CloudAuthentication
        message={this.props.message}
        mode={this.state.mode}
        onAuthenticateWithEmail={this.onAuthenticateWithEmail}
        onAuthenticateWithGitHub={this.onAuthenticateWithGitHub}
        onModeChange={this.onModeChange}
        onReopenGitHubUrl={this.onReopenGitHubUrl}
        onSignUp={this.onSignUp}
        status={this.state.status}
      />
    );
  }

  protected onAuthenticateWithEmail = async (
    email: string,
    password: string,
  ) => {
    this.setState({ status: 'authenticating' });
    try {
      await main.authenticateWithEmail(email, password);
      this.setCloudIntroduced(true);
      // We could have closed not but it will get closed when the status updates
    } catch (err) {
      showError('Failed to authenticate with email', err);
    } finally {
      this.setState({ status: 'idle' });
    }
  };

  protected onAuthenticateWithGitHub = async () => {
    this.setState({ status: 'awaiting-github' });
    try {
      const response = await main.authenticateWithGitHub();
      this.setCloudIntroduced(true);
      // We could have closed not but it will get closed when the status updates
    } catch (err) {
      // This error is expected when closing down
      if (err.message !== 'Pending GitHub authentications were aborted') {
        showError('Failed to authenticate with GitHub', err);
      }
    } finally {
      this.setState({ status: 'idle' });
    }
  };

  protected onModeChange = (mode: Mode) => {
    this.setState({ mode });
  };

  protected onReopenGitHubUrl = () => {
    main.reopenGitHubUrl();
  };

  protected onSignUp = async (email: string, password: string) => {
    this.setState({ status: 'signing-up' });
    try {
      await raas.user.postEmailSignup(email, password);
      this.setCloudIntroduced(true);
      this.setState({ mode: 'verify-email' });
    } catch (err) {
      showError('Failed to sign up', err);
    } finally {
      this.setState({ status: 'idle' });
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
