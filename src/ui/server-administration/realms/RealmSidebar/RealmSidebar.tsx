import * as React from 'react';
import { Button, Card, CardBlock, CardTitle } from 'reactstrap';

import { ConfirmModal } from '../../../reusable/confirm-modal';
import { Sidebar } from '../../sidebar';

import * as ros from '../../../../services/ros';

export const RealmSidebar = ({
  isOpen,
  realm,
  onDeleteRealm,
  deleteRealmModal,
}: {
  isOpen: boolean;
  realm: ros.IRealmFile | null;
  onDeleteRealm: (path: string) => void;
  deleteRealmModal?: {
    yes: () => void;
    no: () => void;
  };
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
              onClick={() => onDeleteRealm(realm.path)}
            >
              Delete
            </Button>
            {deleteRealmModal && (
              <ConfirmModal
                title="Deleting realm ..."
                description="Before deleting the Realm here, make sure that any / all clients (iOS, Android, Js, etc.) has already deleted the app or database locally. If this is not done, they will try to upload their copy of the database - which might have been replaced in the meantime."
                status={true}
                yes={deleteRealmModal.yes}
                no={deleteRealmModal.no}
              />
            )}
          </CardBlock>
        </Card>
      )}
    </Sidebar>
  );
};
