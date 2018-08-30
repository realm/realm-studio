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

import * as React from 'react';
import { Input } from 'reactstrap';

import { CredentialsFormGroup } from './CredentialsFormGroup';

export const JwtForm = ({
  isRequired,
  token,
  onTokenChanged,
  providerName,
  onProviderNameChanged,
}: {
  isRequired: boolean;
  token: string;
  onTokenChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  providerName: string;
  onProviderNameChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <CredentialsFormGroup label="Provider" labelFor="providerName">
      <Input
        type="text"
        name="providerName"
        id="providerName"
        bsSize="sm"
        placeholder="jwt"
        value={providerName}
        onChange={onProviderNameChanged}
      />
    </CredentialsFormGroup>

    <CredentialsFormGroup label="Token" labelFor="token">
      <Input
        id="token"
        name="token"
        onChange={onTokenChanged}
        required={isRequired}
        bsSize="sm"
        type="text"
        value={token}
      />
    </CredentialsFormGroup>
  </div>
);
