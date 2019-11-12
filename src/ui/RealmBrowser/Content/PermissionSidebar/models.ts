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

import Realm from 'realm';

export interface IClass {
  name: string;
  permissions: Permissions;
}

export interface IDefaultRealmVersion {
  id: number;
  version: number;
}

export interface IPermission {
  role?: IRole;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canSetPermissions: boolean;
  canQuery: boolean;
  canCreate: boolean;
  canModifySchema: boolean;
}

export type Action =
  | 'canRead'
  | 'canUpdate'
  | 'canDelete'
  | 'canSetPermissions'
  | 'canQuery'
  | 'canCreate'
  | 'canModifySchema';

export interface IRealm {
  id: number;
  permissions: Permissions;
}

export interface IRole {
  name: string;
  members: Realm.Collection<IUser & Realm.Object>;
}

export interface IUser {
  id: string;
  role?: IRole;
}

export type Permissions = Realm.Collection<IPermission & Realm.Object>;
