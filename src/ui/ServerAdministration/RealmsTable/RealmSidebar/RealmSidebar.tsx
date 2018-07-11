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

import * as ros from '../../../../services/ros';
import { Sidebar } from '../../shared/Sidebar';

import { RealmSidebarCard } from './RealmSidebarCard';

import './RealmSidebar.scss';

export const RealmSidebar = ({
  getRealmPermissions,
  getRealmStateSize,
  isOpen,
  onRealmDeletion,
  onRealmOpened,
  onRealmTypeUpgrade,
  onToggle,
  realm,
}: {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  getRealmStateSize: (path: string) => number | undefined;
  isOpen: boolean;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmTypeUpgrade: (path: string) => void;
  onToggle: () => void;
  realm?: ros.IRealmFile;
}) => {
  // We need this type-hax because we don't want the IRealmFile to have a isValid method when it gets created
  const currentRealm = realm
    ? ((realm as any) as ros.IRealmFile & Realm.Object)
    : undefined;
  return (
    <Sidebar className="RealmSidebar" isOpen={isOpen} onToggle={onToggle}>
      {currentRealm &&
        currentRealm.isValid() && (
          <RealmSidebarCard
            onRealmDeletion={onRealmDeletion}
            onRealmOpened={onRealmOpened}
            onRealmTypeUpgrade={onRealmTypeUpgrade}
            permissions={getRealmPermissions(currentRealm.path)}
            realm={currentRealm}
            stateSize={getRealmStateSize(currentRealm.path)}
          />
        )}
    </Sidebar>
  );
};
