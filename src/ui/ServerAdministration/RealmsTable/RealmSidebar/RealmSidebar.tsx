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

import { IDeletionProgress, RealmFile } from '..';
import * as ros from '../../../../services/ros';
import { Sidebar } from '../../shared/Sidebar';

import { MultipleRealmsSidebarCard } from './MultipleRealmsSidebarCard';
import { SingleRealmSidebarCard } from './SingleRealmSidebarCard';

import './RealmSidebar.scss';

export const RealmSidebar = ({
  deletionProgress,
  getRealmPermissions,
  getRealmStateSize,
  isOpen,
  onRealmDeletion,
  onRealmOpened,
  onRealmTypeUpgrade,
  onToggle,
  realms,
}: {
  deletionProgress?: IDeletionProgress;
  getRealmPermissions: (realm: RealmFile) => Realm.Results<ros.IPermission>;
  getRealmStateSize: (realm: RealmFile) => number | undefined;
  isOpen: boolean;
  onRealmDeletion: (realm: RealmFile) => void;
  onRealmOpened: (realm: RealmFile) => void;
  onRealmTypeUpgrade: (realm: RealmFile) => void;
  onToggle: () => void;
  realms: RealmFile[];
}) => (
  <Sidebar className="RealmSidebar" isOpen={isOpen} onToggle={onToggle}>
    {realms.length === 1 ? (
      <SingleRealmSidebarCard
        onRealmDeletion={onRealmDeletion}
        onRealmOpened={onRealmOpened}
        onRealmTypeUpgrade={onRealmTypeUpgrade}
        permissions={getRealmPermissions(realms[0])}
        realm={realms[0]}
        stateSize={getRealmStateSize(realms[0])}
      />
    ) : realms.length > 1 ? (
      <MultipleRealmsSidebarCard
        deletionProgress={deletionProgress}
        onRealmDeletion={onRealmDeletion}
        realms={realms}
      />
    ) : null}
  </Sidebar>
);
