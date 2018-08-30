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

export type ServerCredentialsKind = 'password' | 'token' | 'other' | 'jwt';

interface ICredentials {
  kind: ServerCredentialsKind;
  url: string;
}

export interface IUsernamePasswordCredentials extends ICredentials {
  kind: 'password';
  username: string;
  password: string;
}

export interface IAdminTokenCredentials extends ICredentials {
  kind: 'token';
  token: string;
}

export interface IJwtCredentials extends ICredentials {
  kind: 'jwt';
  providerName: string;
  token: string;
}

export interface IOtherCredentials extends ICredentials {
  kind: 'other';
  options: object;
}

export type IServerCredentials =
  | IUsernamePasswordCredentials
  | IAdminTokenCredentials
  | IOtherCredentials
  | IJwtCredentials;
