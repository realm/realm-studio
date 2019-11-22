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
import Realm from 'realm';

import { RealmFile } from '..';
import * as ros from '../../../../services/ros';
import { SidebarBody, SidebarControls, SidebarTitle } from '../../../reusable';
import { IRealmFileSize, IRealmStateSize } from '../../MetricsRealm';
import { displayUser, prettyBytes, shortenRealmPath } from '../../utils';
import { RealmSize } from '../RealmSize';
import { RealmTypeBadge } from '../RealmTypeBadge';

import { PermissionsTable } from './PermissionsTable';

interface ISingleRealmContentProps {
  onRealmDeletion: (realm: RealmFile) => void;
  onRealmOpened: (realm: RealmFile, usingGrahpiql?: boolean) => void;
  realm: RealmFile;
  permissions: Realm.Results<ros.IPermission>;
  realmStateSize: IRealmStateSize | undefined;
  realmFileSize: IRealmFileSize | undefined;
  onRealmSizeRecalculate: (realm: RealmFile) => void;
  shouldShowRealmSize: boolean;
}

export const SingleRealmContent = ({
  onRealmDeletion,
  onRealmOpened,
  permissions,
  realm,
  realmStateSize,
  realmFileSize,
  onRealmSizeRecalculate,
  shouldShowRealmSize,
}: ISingleRealmContentProps) => {
  const isSystemRealm = realm && realm.path.startsWith('/__');
  const isFullRealm =
    ['partial', 'reference'].indexOf(realm.realmType || '') === -1;
  // Generate a list of known size labels
  const sizeLabels = [];
  if (shouldShowRealmSize) {
    sizeLabels.push(
      realmStateSize ? prettyBytes(realmStateSize.value) + ' (data)' : null
    );
    sizeLabels.push(
      realmFileSize ? prettyBytes(realmFileSize.value) + ' (file)' : null
    );
  }

  return (
    <React.Fragment>
      <SidebarTitle>
        <RealmTypeBadge
          className="RealmSidebar__TypeBadge"
          type={realm.realmType}
        />
        <span className="RealmSidebar__TitleText" title={realm.path}>
          {shortenRealmPath(realm.path)}
        </span>
      </SidebarTitle>
      <SidebarBody>
        <p className="RealmSidebar__SubTitle">
          Owned by {displayUser(realm.owner)}
        </p>
        {shouldShowRealmSize ? (
          <p>
            {'Size: '}
            <RealmSize metric={realmStateSize} title="Data" suffix="(data)" />
            {' / '}
            <RealmSize metric={realmFileSize} title="File" suffix="(file)" />
          </p>
        ) : null}
      </SidebarBody>
      {isFullRealm ? (
        <SidebarBody className="RealmSidebar__Tables" grow={1}>
          {permissions ? <PermissionsTable permissions={permissions} /> : null}
        </SidebarBody>
      ) : null}
      <SidebarControls>
        <Button size="sm" color="primary" onClick={() => onRealmOpened(realm)}>
          Open
        </Button>
        <Button
          size="sm"
          color="secondary"
          onClick={() => onRealmOpened(realm, true)}
        >
          Open with Graph<i>i</i>QL
        </Button>
        <Button
          size="sm"
          color="secondary"
          onClick={() => onRealmSizeRecalculate(realm)}
        >
          Recalculate size
        </Button>
        {isSystemRealm ? null : (
          <Button
            size="sm"
            color="danger"
            onClick={() => onRealmDeletion(realm)}
          >
            Delete
          </Button>
        )}
      </SidebarControls>
    </React.Fragment>
  );
};
