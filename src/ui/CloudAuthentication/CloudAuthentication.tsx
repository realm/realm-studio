import * as classNames from 'classnames';
import * as React from 'react';
import { Alert, Button, Form, FormGroup, Input } from 'reactstrap';

import { Mode } from '.';
import cloudLogo from '../../../static/svgs/cloud-logo.svg';
import { LoadingOverlay } from '../reusable/loading-overlay';
import { IntroductionOverlay } from './IntroductionOverlay';
import { LogInForm } from './LogInForm';
import { SignUpForm } from './SignUpForm';
import { WaitlistOverlay } from './WaitlistOverlay';

import './CloudAuthentication.scss';

interface ICloudAuthenticationProps {
  error?: Error;
  isLoading: boolean;
  mode: Mode;
  onAuthenticateWithEmail: (email: string, password: string) => void;
  onAuthenticateWithGitHub: () => void;
  onModeChange: (mode: Mode) => void;
  onSignUp: (email: string) => void;
}

export const CloudAuthentication = ({
  error,
  isLoading,
  mode,
  onAuthenticateWithEmail,
  onAuthenticateWithGitHub,
  onModeChange,
  onSignUp,
}: ICloudAuthenticationProps) => (
  <div
    className={classNames(
      'CloudAuthentication',
      `CloudAuthentication--${mode}`,
    )}
  >
    <div className="CloudAuthentication__Brand">
      <svg className="CloudAuthentication__Icon" viewBox={cloudLogo.viewBox}>
        <use xlinkHref={`#${cloudLogo.id}`} />
      </svg>
      <h3 className="CloudAuthentication__Title">Realm Cloud</h3>
    </div>
    <div className="CloudAuthentication__Form">
      {error && <Alert color="danger">{error.message}</Alert>}
      {mode === 'log-in' && (
        <LogInForm
          onAuthenticateWithEmail={onAuthenticateWithEmail}
          onAuthenticateWithGitHub={onAuthenticateWithGitHub}
          onModeChange={onModeChange}
        />
      )}
      {mode === 'sign-up' && (
        <SignUpForm
          onAuthenticateWithGitHub={onAuthenticateWithGitHub}
          onModeChange={onModeChange}
          onSignUp={onSignUp}
        />
      )}
      {mode === 'introduction' && (
        <IntroductionOverlay onModeChange={onModeChange} />
      )}
      {mode === 'waitlist' && <WaitlistOverlay onModeChange={onModeChange} />}
    </div>
    <LoadingOverlay loading={isLoading} />
  </div>
);
