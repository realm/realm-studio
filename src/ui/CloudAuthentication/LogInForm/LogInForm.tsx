////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

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
          required
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
          required
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
