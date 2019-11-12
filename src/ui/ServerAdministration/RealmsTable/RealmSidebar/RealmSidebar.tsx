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
import Realm from 'realm';

import { IDeletionProgress, MetricGetter, RealmFile } from '..';
import * as ros from '../../../../services/ros';
import { Sidebar } from '../../../reusable';

import { MultipleRealmsContent } from './MultipleRealmsContent';
import { SingleRealmContent } from './SingleRealmContent';

import './RealmSidebar.scss';

export const RealmSidebar = ({
  deletionProgress,
  getRealmPermissions,
  getMetric,
  isOpen,
  onRealmDeletion,
  onRealmOpened,
  onRealmTypeUpgrade,
  onClose,
  realms,
  onRealmSizeRecalculate,
  shouldShowRealmSize,
}: {
  deletionProgress?: IDeletionProgress;
  getRealmPermissions: (realm: RealmFile) => Realm.Results<ros.IPermission>;
  getMetric: MetricGetter;
  isOpen: boolean;
  onRealmDeletion: (realm: RealmFile) => void;
  onRealmOpened: (realm: RealmFile, usingGrahpiql?: boolean) => void;
  onRealmTypeUpgrade: (realm: RealmFile) => void;
  onRealmSizeRecalculate: (realm: RealmFile) => void;
  onClose: () => void;
  realms: RealmFile[];
  shouldShowRealmSize: boolean;
}) => (
  <Sidebar
    className="RealmSidebar"
    contentClassName="RealmSidebar__Content"
    isOpen={isOpen}
    onClose={onClose}
    position="right"
    initialWidth={300}
  >
    {realms.length === 1 ? (
      <SingleRealmContent
        onRealmDeletion={onRealmDeletion}
        onRealmOpened={onRealmOpened}
        onRealmTypeUpgrade={onRealmTypeUpgrade}
        permissions={getRealmPermissions(realms[0])}
        realm={realms[0]}
        realmFileSize={getMetric(realms[0], 'RealmFileSize')}
        realmStateSize={getMetric(realms[0], 'RealmStateSize')}
        onRealmSizeRecalculate={onRealmSizeRecalculate}
        shouldShowRealmSize={shouldShowRealmSize}
        key={realms[0].path}
      />
    ) : realms.length > 1 ? (
      <MultipleRealmsContent
        deletionProgress={deletionProgress}
        onRealmDeletion={onRealmDeletion}
        realms={realms}
      />
    ) : null}
  </Sidebar>
);
