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

import './SignUpForm.scss';

export const SignUpForm = ({
  className,
  email,
  error,
  onAuthenticateWithGitHub,
  onEmailChange,
  onEmailSubmit,
  onModeChange,
}: {
  className?: string;
  email: string;
  error?: Error;
  onAuthenticateWithGitHub: () => void;
  onEmailChange: (email: string) => void;
  onEmailSubmit: () => void;
  onModeChange: (mode: Mode) => void;
}) => (
  <Form
    className={classNames('SignUpForm', className)}
    onSubmit={e => {
      e.preventDefault();
      onEmailSubmit();
    }}
  >
    <FormGroup>
      <Label for="sign-up-email" hidden>
        Email
      </Label>
      <Input
        type="email"
        id="sign-up-email"
        placeholder="Email"
        value={email}
        onChange={e => {
          onEmailChange(e.target.value);
        }}
      />
    </FormGroup>
    <FormGroup>
      <Button className="SignUpForm__SubmitButton" color="primary">
        Sign up
      </Button>
    </FormGroup>
    <FormGroup className="SignUpForm__GitHub">
      <Button
        className="SignUpForm__GitHubButton"
        color="secondary"
        onClick={onAuthenticateWithGitHub}
      >
        <i className="fa fa-github" aria-hidden="true" /> Sign up using GitHub
      </Button>
    </FormGroup>
    <FormGroup>
      Or{' '}
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          onModeChange('log-in');
        }}
      >
        log into an existing account!
      </a>
    </FormGroup>
    {error ? <Alert color="danger">{error.message}</Alert> : null}
  </Form>
);
