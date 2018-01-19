import * as React from 'react';
import { Alert, Button, Form, FormGroup, Input } from 'reactstrap';

import cloudLogo from '../../../static/svgs/cloud-logo.svg';
import { LoadingOverlay } from '../reusable/loading-overlay';

import './CloudAuthentication.scss';

interface ICloudAuthenticationProps {
  email: string;
  error?: Error;
  isLoading: boolean;
  onAuthenticateWithEmail: () => void;
  onAuthenticateWithGitHub: () => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  password: string;
}

export const CloudAuthentication = ({
  email,
  error,
  isLoading,
  onAuthenticateWithEmail,
  onAuthenticateWithGitHub,
  onEmailChange,
  onPasswordChange,
  password,
}: ICloudAuthenticationProps) => (
  <div className="CloudAuthentication">
    <svg className="CloudAuthentication__Icon" viewBox={cloudLogo.viewBox}>
      <use xlinkHref={`#${cloudLogo.id}`} />
    </svg>
    <h3 className="CloudAuthentication__Title">Realm Cloud</h3>
    <Form
      className="CloudAuthentication__Form"
      onSubmit={e => {
        e.preventDefault();
        onAuthenticateWithEmail();
      }}
    >
      {error && <Alert color="danger">{error.message}</Alert>}
      <FormGroup>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Button className="CloudAuthentication__Button" color="primary">
          Log in
        </Button>
      </FormGroup>
      <Button
        className="CloudAuthentication__Button"
        color="secondary"
        onClick={e => {
          e.preventDefault();
          onAuthenticateWithGitHub();
        }}
      >
        Log in using GitHub
      </Button>
    </Form>
    <LoadingOverlay loading={isLoading} />
  </div>
);
