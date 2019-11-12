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
import { Input } from 'reactstrap';

import { CredentialsFormGroup } from './CredentialsFormGroup';

export const UsernamePasswordForm = ({
  isRequired,
  username,
  password,
  onUsernameChanged,
  onPasswordChanged,
}: {
  isRequired: boolean;
  username: string;
  password: string;
  onUsernameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <CredentialsFormGroup label="Username" labelFor="username">
      <Input
        type="text"
        name="username"
        id="username"
        bsSize="sm"
        placeholder="realm-admin"
        value={username}
        onChange={onUsernameChanged}
      />
    </CredentialsFormGroup>
    <CredentialsFormGroup label="Password" labelFor="password">
      <Input
        type="password"
        name="password"
        id="password"
        bsSize="sm"
        value={password}
        onChange={onPasswordChanged}
      />
    </CredentialsFormGroup>
  </div>
);
