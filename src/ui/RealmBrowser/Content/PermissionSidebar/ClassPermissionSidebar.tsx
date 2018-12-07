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

import { Sidebar } from '../../../reusable';

import { Action, IPermission, IRole, Permissions } from '.';
import { ClassSection } from './ClassSection';
import { RealmSection } from './RealmSection';

interface IClassPermissionSidebarBaseProps {
  className?: string;
  isOpen: boolean;
  name: string;
  onToggle?: () => void;
  classPermissions: Permissions | null;
  realmPermissions: Permissions | null;
  onPermissionChange: (
    permission: IPermission,
    action: Action,
    enabled: boolean,
  ) => void;
  onRoleClick: (role: IRole) => void;
}

export const ClassPermissionSidebar = ({
  className,
  isOpen,
  name,
  onToggle,
  classPermissions,
  realmPermissions,
  onPermissionChange,
  onRoleClick,
}: IClassPermissionSidebarBaseProps) => (
  <Sidebar
    className={className}
    isOpen={isOpen}
    onToggle={onToggle}
    position="right"
    initialWidth={300}
  >
    <ClassSection
      name={name}
      permissions={classPermissions}
      onPermissionChange={onPermissionChange}
      onRoleClick={onRoleClick}
    />
    <RealmSection
      permissions={realmPermissions}
      onPermissionChange={onPermissionChange}
      onRoleClick={onRoleClick}
    />
  </Sidebar>
);
