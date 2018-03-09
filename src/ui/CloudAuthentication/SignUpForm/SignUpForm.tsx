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
  onAuthenticateWithGitHub,
  onEmailChange,
  onEmailSubmit,
  onModeChange,
  onPasswordChange,
  password,
}: {
  className?: string;
  email: string;
  onAuthenticateWithGitHub: () => void;
  onEmailChange: (email: string) => void;
  onEmailSubmit: () => void;
  onModeChange: (mode: Mode) => void;
  onPasswordChange: (password: string) => void;
  password: string;
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
        required
        value={email}
        onChange={e => {
          onEmailChange(e.target.value);
        }}
      />
    </FormGroup>
    <FormGroup>
      <Label for="sign-up-password" hidden>
        Password
      </Label>
      <Input
        type="password"
        id="sign-up-password"
        placeholder="Password"
        required
        value={password}
        onChange={e => {
          onPasswordChange(e.target.value);
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
  </Form>
);
