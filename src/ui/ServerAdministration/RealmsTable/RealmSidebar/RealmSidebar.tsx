import * as React from 'react';
import { Button, Card, CardBlock, CardTitle } from 'reactstrap';

import * as ros from '../../../../services/ros';
import { Sidebar } from '../../shared/Sidebar';
import { displayUser, shortenRealmPath } from '../../utils';
import { RealmTypeBadge } from '../RealmTypeBadge';

import { PermissionsTable } from './PermissionsTable';

import './RealmSidebar.scss';

export const RealmSidebar = ({
  getRealmPermissions,
  isOpen,
  onRealmDeletion,
  onRealmOpened,
  onRealmTypeUpgrade,
  onToggle,
  realm,
}: {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  isOpen: boolean;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  onRealmTypeUpgrade: (path: string) => void;
  onToggle: () => void;
  realm?: ros.IRealmFile;
}) => {
  const permissions = realm ? getRealmPermissions(realm.path) : null;
  // Determine if the Realm can be upgraded to a "reference" Realm,
  // It can if its defined and not already "partial" or "reference"
  const canUpgradeType = realm
    ? ['partial', 'reference'].indexOf(realm.realmType || '') === -1
    : false;
  return (
    <Sidebar className="RealmSidebar" isOpen={isOpen} onToggle={onToggle}>
      {realm && (
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
            {permissions ? (
              <PermissionsTable permissions={permissions} />
            ) : null}
          </CardBlock>
          {canUpgradeType ? (
            <CardBlock className="RealmSidebar__UpgradeTypeBlock">
              <p className="RealmSidebar__UpgradeTypeText">
                This Realm can be upgraded to enable{' '}
                <a
                  target="_blank"
                  href="https://docs.realm.io/platform/using-synced-realms/access-control#overview"
                >
                  Fine-Grained Permissions
                </a>. Note: Doing so will clear path-level permissions.
              </p>
              <Button
                size="sm"
                color="secondary"
                onClick={() => onRealmTypeUpgrade(realm.path)}
              >
                Upgrade and change type to "reference"
              </Button>
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
            <Button
              size="sm"
              color="danger"
              onClick={() => onRealmDeletion(realm.path)}
            >
              Delete
            </Button>
          </CardBlock>
        </Card>
      )}
    </Sidebar>
  );
};
