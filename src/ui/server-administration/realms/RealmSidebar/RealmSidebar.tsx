import * as React from 'react';
import { Button, Card, CardBlock, CardTitle } from 'reactstrap';

import * as ros from '../../../../services/ros';

import { Sidebar } from '../../shared/Sidebar';
import { displayUser } from '../../utils';
import { PermissionsTable } from './PermissionsTable';

export const RealmSidebar = ({
  getRealmPermissions,
  isOpen,
  onRealmDeletion,
  onRealmOpened,
  realm,
}: {
  getRealmPermissions: (path: string) => Realm.Results<ros.IPermission>;
  isOpen: boolean;
  onRealmDeletion: (path: string) => void;
  onRealmOpened: (path: string) => void;
  realm: ros.IRealmFile | null;
}) => {
  const permissions = realm ? getRealmPermissions(realm.path) : null;
  return (
    <Sidebar isOpen={isOpen}>
      {realm && (
        <Card className="Sidebar__Card">
          <CardBlock className="Sidebar__Top">
            <CardTitle className="Sidebar__Title">
              <span title={realm.path}>{realm.path}</span>
            </CardTitle>
            <p>Owned by {displayUser(realm.owner)}</p>
          </CardBlock>
          <CardBlock className="Sidebar__Tables">
            {permissions ? (
              <PermissionsTable permissions={permissions} />
            ) : null}
          </CardBlock>
          <CardBlock className="Sidebar__Controls">
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
