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
import * as Realm from 'realm';

import { Sidebar } from '../../../reusable';
import { Focus } from '../../focus';
import { IHighlight } from '../Table';

import { Action, IPermission, IRole, Permissions } from '.';
import { ObjectSection } from './ObjectSection';

interface IObjectPermissionSidebarProps {
  className?: string;
  focus: Focus;
  getObjectPermissions: (object: any & Realm.Object) => Permissions;
  hasPermissionProperty: boolean;
  highlight: IHighlight;
  isOpen: boolean;
  onToggle?: () => void;
  onPermissionChange: (
    permission: IPermission,
    action: Action,
    enabled: boolean,
  ) => void;
  onRoleClick: (role: IRole) => void;
}

export const ObjectPermissionSidebar = ({
  className,
  focus,
  getObjectPermissions,
  hasPermissionProperty,
  highlight,
  isOpen,
  onPermissionChange,
  onRoleClick,
  onToggle,
}: IObjectPermissionSidebarProps) => (
  <Sidebar
    className={className}
    isOpen={isOpen}
    onToggle={onToggle}
    position="right"
    initialWidth={300}
  >
    <ObjectSection
      getPermissions={(object: any & Realm.Object) =>
        getObjectPermissions(object)
      }
      hasPermissionProperty={hasPermissionProperty}
      objects={Array.from(highlight.rows.values()).map(
        index => focus.results[index],
      )}
      onPermissionChange={onPermissionChange}
      onRoleClick={onRoleClick}
    />
  </Sidebar>
);
