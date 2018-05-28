import * as classNames from 'classnames';
import * as React from 'react';

import { Mode, Status } from '.';
import cloudLogo from '../../../static/svgs/cloud-logo.svg';
import { LoadingOverlay } from '../reusable/LoadingOverlay';

import { IntroductionOverlay } from './IntroductionOverlay';
import { LogInForm } from './LogInForm';
import { SignUpForm } from './SignUpForm';
import { VerifyEmailOverlay } from './VerifyEmailOverlay';

import './CloudAuthentication.scss';

interface ICloudAuthenticationProps {
  message?: string;
  mode: Mode;
  onAuthenticateWithEmail: (email: string, password: string) => void;
  onAuthenticateWithGitHub: () => void;
  onModeChange: (mode: Mode) => void;
  onReopenGitHubUrl: () => void;
  onSignUp: (email: string, password: string) => void;
  status: Status;
}

export const CloudAuthentication = ({
  message,
  mode,
  onAuthenticateWithEmail,
  onAuthenticateWithGitHub,
  onModeChange,
  onReopenGitHubUrl,
  onSignUp,
  status,
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
    <LoadingOverlay
      loading={status !== 'idle'}
      progress={
        status === 'awaiting-github'
          ? {
              status: 'in-progress',
              message: 'Waiting for you to grant access',
              retry: {
                onRetry: onReopenGitHubUrl,
                label: 'Open GitHub again',
              },
            }
          : undefined
      }
    />
  </div>
);
