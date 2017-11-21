import * as React from 'react';
import {
  Button,
  Card,
  CardBlock,
  CardTitle,
} from 'reactstrap';

import { Sidebar } from '../../sidebar';
import { IRealmSidebarContainerProps } from './RealmSidebarContainer';

export const RealmSidebar = ({
  isOpen,
  realm,
}: IRealmSidebarContainerProps) => {
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
            <Button size="sm" color="danger" disabled>
              Delete
            </Button>
          </CardBlock>
        </Card>
      )}
    </Sidebar>
  );
};
