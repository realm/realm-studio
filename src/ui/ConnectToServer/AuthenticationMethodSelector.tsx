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
import { Button } from 'reactstrap';

import { AuthenticationMethod } from '../../utils/realms';

export type MethodChangedHandler = (method: AuthenticationMethod) => void;

const AuthenticationMethodButton = ({
  activeMethod,
  children,
  method,
  onMethodChanged,
}: {
  activeMethod: AuthenticationMethod;
  children: React.ReactNode;
  method: AuthenticationMethod;
  onMethodChanged: MethodChangedHandler;
}) => (
  <Button
    className="ConnectToServer__AuthenticationMethodSelector__Btn"
    size="sm"
    color={method === activeMethod ? 'primary' : 'secondary'}
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      onMethodChanged(method);
    }}
  >
    {children}
  </Button>
);

export const AuthenticationMethodSelector = ({
  method,
  onMethodChanged,
}: {
  method: AuthenticationMethod;
  onMethodChanged: MethodChangedHandler;
}) => (
  <div className="ConnectToServer__AuthenticationMethodSelector">
    <AuthenticationMethodButton
      activeMethod={method}
      method={AuthenticationMethod.anonymous}
      onMethodChanged={onMethodChanged}
    >
      Anonymous
    </AuthenticationMethodButton>
    <AuthenticationMethodButton
      activeMethod={method}
      method={AuthenticationMethod.emailPassword}
      onMethodChanged={onMethodChanged}
    >
      Email & password
    </AuthenticationMethodButton>
    <AuthenticationMethodButton
      activeMethod={method}
      method={AuthenticationMethod.apiKey}
      onMethodChanged={onMethodChanged}
    >
      API Key
    </AuthenticationMethodButton>
    <AuthenticationMethodButton
      activeMethod={method}
      method={AuthenticationMethod.jwt}
      onMethodChanged={onMethodChanged}
    >
      JWT
    </AuthenticationMethodButton>
  </div>
);
