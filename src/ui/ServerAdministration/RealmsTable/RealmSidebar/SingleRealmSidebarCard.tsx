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
import { Button, Card, CardBody, CardText, CardTitle } from 'reactstrap';
import * as Realm from 'realm';

import { RealmFile } from '..';
import * as ros from '../../../../services/ros';
import { displayUser, prettyBytes, shortenRealmPath } from '../../utils';
import { RealmTypeBadge } from '../RealmTypeBadge';

import { PermissionsTable } from './PermissionsTable';

export const SingleRealmSidebarCard = ({
  onRealmDeletion,
  onRealmOpened,
  onRealmTypeUpgrade,
  permissions,
  realm,
  stateSize,
}: {
  onRealmDeletion: (realm: RealmFile) => void;
  onRealmOpened: (realm: RealmFile, usingGrahpiql?: boolean) => void;
  onRealmTypeUpgrade: (realm: RealmFile) => void;
  realm: RealmFile;
  permissions: Realm.Results<ros.IPermission>;
  stateSize?: number;
}) => {
  // Determine if the Realm can be upgraded to a "reference" Realm,
  // It can if its defined and not already "partial" or "reference"
  const canUpgradeType = realm
    ? ['partial', 'reference'].indexOf(realm.realmType || '') === -1
    : false;
  return (
    <Card className="RealmSidebar__Card">
      <CardBody className="RealmSidebar__Top">
        <CardTitle className="RealmSidebar__Title">
          <RealmTypeBadge
            className="RealmSidebar__TypeBadge"
            type={realm.realmType}
          />
          <span className="RealmSidebar__TitleText" title={realm.path}>
            {shortenRealmPath(realm.path)}
          </span>
        </CardTitle>
        <CardText className="RealmSidebar__SubTitle">
          Owned by {displayUser(realm.owner)}
        </CardText>
        {typeof stateSize === 'number' ? (
          <CardText className="RealmSidebar__SubTitle">
            Data size: {prettyBytes(stateSize)}
          </CardText>
        ) : null}
      </CardBody>
      <CardBody className="RealmSidebar__Tables">
        {permissions ? <PermissionsTable permissions={permissions} /> : null}
      </CardBody>
      {canUpgradeType ? (
        <CardBody className="RealmSidebar__UpgradeTypeBlock">
          This Realm can be upgraded to a Reference Realm which will enable{' '}
          <a
            target="_blank"
            href="https://docs.realm.io/platform/using-synced-realms/syncing-data"
          >
            query-based synchronization
          </a>{' '}
          and{' '}
          <a
            target="_blank"
            href="https://docs.realm.io/platform/using-synced-realms/access-control#overview"
          >
            Fine-Grained Permissions
          </a>. Note: Doing so will remove any existing permissions.
        </CardBody>
      ) : null}
      <CardBody className="RealmSidebar__Controls">
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
        {canUpgradeType ? (
          <Button
            size="sm"
            color="secondary"
            onClick={() => onRealmTypeUpgrade(realm)}
          >
            Upgrade
          </Button>
        ) : null}
        <Button size="sm" color="danger" onClick={() => onRealmDeletion(realm)}>
          Delete
        </Button>
      </CardBody>
    </Card>
  );
};
