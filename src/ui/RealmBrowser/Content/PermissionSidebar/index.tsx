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

import { IPropertyWithName } from '../..';
import { Sidebar } from '../../../reusable';
import { Focus } from '../../focus';
import { IHighlight } from '../Table';

import { ClassSection } from './ClassSection';
import { ObjectSection } from './ObjectSection';
import { RealmSection } from './RealmSection';

import { Permissions } from './models';
export * from './models';

function getPermissionsProperty(properties: IPropertyWithName[]) {
  return properties.find(property => {
    return property.type === 'list' && property.objectType === '__Permission';
  });
}

function getObjectPermissions(
  object: any & Realm.Object,
  properties: IPropertyWithName[],
) {
  const property = getPermissionsProperty(properties);
  if (property && property.name && property.name in object) {
    return object[property.name];
  } else {
    return null;
  }
}

interface IPermissionSidebarProps {
  className?: string;
  isOpen: boolean;
  onToggle?: () => void;
  highlight?: IHighlight;
  focus: Focus;
  // TODO: Internalize these methods once Studio uses the Realm react context
  getClassPermissions: (className: string) => Permissions;
  getRealmPermissions: () => Permissions;
}

export const PermissionSidebar = ({
  className,
  isOpen,
  onToggle,
  focus,
  highlight,
  getClassPermissions,
  getRealmPermissions,
}: IPermissionSidebarProps) => (
  <Sidebar
    className={className}
    isOpen={isOpen}
    onToggle={onToggle}
    position="right"
    initialWidth={300}
  >
    {highlight ? (
      <ObjectSection
        getPermissions={(object: any & Realm.Object) =>
          getObjectPermissions(object, focus.properties)
        }
        hasPermissionColumn={!!getPermissionsProperty(focus.properties)}
        objects={Array.from(highlight.rows.values()).map(
          index => focus.results[index],
        )}
      />
    ) : (
      <React.Fragment>
        {focus.kind === 'class' ? (
          <ClassSection permissions={getClassPermissions(focus.className)} />
        ) : null}
        <RealmSection permissions={getRealmPermissions()} />
      </React.Fragment>
    )}
  </Sidebar>
);
