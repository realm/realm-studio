import * as React from 'react';
import { Button, Card, CardBlock, CardTitle } from 'reactstrap';
import * as Realm from 'realm';

import * as ros from '../../../../services/ros';
import { displayUser, shortenRealmPath } from '../../utils';
import { RealmTypeBadge } from '../RealmTypeBadge';

import { PermissionsTable } from './PermissionsTable';

export const RealmSidebarCard = ({
  getRealmPermissions,
  onRealmDeletion,
  onRealmOpened,
  onRealmTypeUpgrade,
  realm,
}: {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmTypeUpgrade: (path: string) => void;
  realm: ros.IRealmFile;
}) => {
  const permissions = realm ? getRealmPermissions(realm.path) : null;
  // Determine if the Realm can be upgraded to a "reference" Realm,
  // It can if its defined and not already "partial" or "reference"
  const canUpgradeType = realm
    ? ['partial', 'reference'].indexOf(realm.realmType || '') === -1
    : false;
  return (
    <Card className="RealmSidebar__Card">
      <CardBlock className="RealmSidebar__Top">
        <CardTitle className="RealmSidebar__Title">
          <RealmTypeBadge
            className="RealmSidebar__TypeBadge"
            type={realm.realmType}
          />
          <span className="RealmSidebar__TitleText" title={realm.path}>
            {shortenRealmPath(realm.path)}
          </span>
        </CardTitle>
        <p className="RealmSidebar__SubTitle">
          Owned by {displayUser(realm.owner)}
        </p>
      </CardBlock>
      <CardBlock className="RealmSidebar__Tables">
        {permissions ? <PermissionsTable permissions={permissions} /> : null}
      </CardBlock>
      {canUpgradeType ? (
        <CardBlock className="RealmSidebar__UpgradeTypeBlock">
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
        </CardBlock>
      ) : null}
      <CardBlock className="RealmSidebar__Controls">
        <Button
          size="sm"
          color="primary"
          onClick={() => onRealmOpened(realm.path)}
        >
          Open
        </Button>
        {canUpgradeType ? (
          <Button
            size="sm"
            color="secondary"
            onClick={() => onRealmTypeUpgrade(realm.path)}
          >
            Upgrade
          </Button>
        ) : null}
        <Button
          size="sm"
          color="danger"
          onClick={() => onRealmDeletion(realm.path)}
        >
          Delete
        </Button>
      </CardBlock>
    </Card>
  );
};
