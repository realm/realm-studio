import * as React from 'react';
import { Button, Card, CardBlock, CardTitle } from 'reactstrap';

import { Sidebar } from '../../sidebar';

import * as ros from '../../../../services/ros';

export const RealmSidebar = ({
  isOpen,
  realm,
  onRealmDeletion,
}: {
  isOpen: boolean;
  realm: ros.IRealmFile | null;
  onRealmDeletion: (path: string) => void;
}) => {
  return (
    <Sidebar isOpen={isOpen}>
      {realm && (
        <Card className="Sidebar__Card">
          <CardBlock className="Sidebar__Top">
            <CardTitle className="Sidebar__Title">
              <span title={realm.path}>{realm.path}</span>
            </CardTitle>
          </CardBlock>
          <CardBlock className="Sidebar__Tables" />
          <CardBlock className="Sidebar__Controls">
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
