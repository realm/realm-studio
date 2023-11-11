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

import React from 'react';

import { AnonymousForm } from './AnonymousForm';
import { ApiKeyForm } from './ApiKeyForm';
import { AuthenticationMethodSelector } from './AuthenticationMethodSelector';
import { JwtForm } from './JwtForm';
import { EmailPasswordForm } from './EmailPasswordForm';

export enum AuthenticationMethod {
  anonymous = 'anonymous',
  emailPassword = 'email-password',
  apiKey = 'api-key',
  jwt = 'jwt',
  // TODO: Add function, apple, google, facebook
}

export const AuthenticationForm = ({
  method,
  email,
  password,
  token,
  apiKey,
  onMethodChanged,
  onEmailChanged,
  onPasswordChanged,
  onTokenChanged,
  onApiKeyChanged,
}: {
  method: AuthenticationMethod;
  email: string;
  password: string;
  token: string;
  apiKey: string;
  onMethodChanged: (method: AuthenticationMethod) => void;
  onEmailChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApiKeyChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  let form;
  switch (method) {
    case AuthenticationMethod.anonymous:
      form = <AnonymousForm />;
      break;
    case AuthenticationMethod.emailPassword:
      form = (
        <EmailPasswordForm
          email={email}
          password={password}
          onEmailChanged={onEmailChanged}
          onPasswordChanged={onPasswordChanged}
        />
      );
      break;
    case AuthenticationMethod.apiKey:
      form = (
        <ApiKeyForm
          apiKey={apiKey}
          onApiKeyChanged={onApiKeyChanged}
          isRequired={!email}
        />
      );
      break;
    case AuthenticationMethod.jwt:
      form = (
        <JwtForm
          token={token}
          onTokenChanged={onTokenChanged}
          isRequired={!email}
        />
      );
      break;
  }
  return (
    <div className="ConnectToServer__AuthenticationForm">
      <AuthenticationMethodSelector
        method={method}
        onMethodChanged={onMethodChanged}
      />
      {form}
    </div>
  );
};
