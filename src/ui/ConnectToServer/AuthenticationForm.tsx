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

import { AdminTokenForm } from './AdminTokenForm';
import { AuthenticationMethodSelector } from './AuthenticationMethodSelector';
import { JwtForm } from './JwtForm';
import { OtherForm } from './OtherForm';
import { UsernamePasswordForm } from './UsernamePasswordForm';

export enum AuthenticationMethod {
  usernamePassword,
  adminToken,
  other,
  jwt,
}

export const AuthenticationForm = ({
  method,
  username,
  password,
  token,
  otherOptions,
  providerName,
  onMethodChanged,
  onUsernameChanged,
  onPasswordChanged,
  onTokenChanged,
  onOtherOptionsChanged,
  onProviderNameChanged,
}: {
  method: AuthenticationMethod;
  username: string;
  password: string;
  token: string;
  otherOptions: string;
  providerName: string;
  onMethodChanged: (method: AuthenticationMethod) => void;
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOtherOptionsChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProviderNameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  let form;
  switch (method) {
    case AuthenticationMethod.usernamePassword:
      form = (
        <UsernamePasswordForm
          username={username}
          password={password}
          isRequired={!token}
          onUsernameChanged={onUsernameChanged}
          onPasswordChanged={onPasswordChanged}
        />
      );
      break;
    case AuthenticationMethod.adminToken:
      form = (
        <AdminTokenForm
          token={token}
          onTokenChanged={onTokenChanged}
          isRequired={!username}
        />
      );
      break;
    case AuthenticationMethod.jwt:
      form = (
        <JwtForm
          token={token}
          onTokenChanged={onTokenChanged}
          isRequired={!username}
          providerName={providerName}
          onProviderNameChanged={onProviderNameChanged}
        />
      );
      break;
    case AuthenticationMethod.other:
      form = (
        <OtherForm
          options={otherOptions}
          onOptionsChanged={onOtherOptionsChanged}
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
