import * as classNames from 'classnames';
import * as React from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
} from 'reactstrap';

import { Mode } from '..';

import './LogInForm.scss';

export const LogInForm = ({
  className,
  email,
  error,
  onAuthenticateWithGitHub,
  onEmailChange,
  onEmailSubmit,
  onModeChange,
  onPasswordChange,
  password,
}: {
  className?: string;
  email: string;
  error?: Error;
  onAuthenticateWithGitHub: () => void;
  onEmailChange: (email: string) => void;
  onEmailSubmit: () => void;
  onModeChange: (mode: Mode) => void;
  onPasswordChange: (password: string) => void;
  password: string;
}) => (
  <Form
    className={classNames('LogInForm', className)}
    onSubmit={e => {
      e.preventDefault();
      onEmailSubmit();
    }}
  >
    <FormGroup>
      <Label for="login-email" hidden>
        Email
      </Label>
      <InputGroup>
        <Input
          type="email"
          id="login-email"
          placeholder="Email"
          value={email}
          onChange={e => {
            onEmailChange(e.target.value);
          }}
        />
      </InputGroup>
    </FormGroup>
    <FormGroup>
      <Label for="login-password" hidden>
        Password
      </Label>
      <InputGroup>
        <Input
          type="password"
          id="login-password"
          placeholder="Password"
          value={password}
          onChange={e => {
            onPasswordChange(e.target.value);
          }}
        />
      </InputGroup>
    </FormGroup>
    <FormGroup>
      <Button className="LogInForm__SubmitButton" color="primary">
        Log in
      </Button>
    </FormGroup>
    <FormGroup className="LogInForm__GitHub">
      <Button
        className="LogInForm__GitHubButton"
        color="secondary"
        onClick={onAuthenticateWithGitHub}
      >
        <i className="fa fa-github" aria-hidden="true" /> Log in using GitHub
      </Button>
    </FormGroup>
    <FormGroup>
      Or{' '}
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          onModeChange('sign-up');
        }}
      >
        sign up now!
      </a>
    </FormGroup>
    {error ? <Alert color="danger">{error.message}</Alert> : null}
  </Form>
);
