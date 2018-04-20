import * as classNames from 'classnames';
import * as React from 'react';
import { Alert, Button, Form, FormGroup, Input } from 'reactstrap';

import { Mode } from '.';
import cloudLogo from '../../../static/svgs/cloud-logo.svg';
import { LoadingOverlay } from '../reusable/LoadingOverlay';

import { IntroductionOverlay } from './IntroductionOverlay/IntroductionOverlay';
import { LogInForm } from './LogInForm';
import { SignUpForm } from './SignUpForm';
import { VerifyEmailOverlay } from './VerifyEmailOverlay';

import './CloudAuthentication.scss';

interface ICloudAuthenticationProps {
  isLoading: boolean;
  message?: string;
  mode: Mode;
  onAuthenticateWithEmail: (email: string, password: string) => void;
  onAuthenticateWithGitHub: () => void;
  onModeChange: (mode: Mode) => void;
  onSignUp: (email: string, password: string) => void;
}

export const CloudAuthentication = ({
  isLoading,
  message,
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
    {message ? <small>{message}</small> : null}
    <div className="CloudAuthentication__Form">
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
      {mode === 'verify-email' && (
        <VerifyEmailOverlay onModeChange={onModeChange} />
      )}
    </div>
    <LoadingOverlay loading={isLoading} />
  </div>
);
