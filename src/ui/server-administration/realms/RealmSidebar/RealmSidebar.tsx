import * as React from 'react';
import {
  Button,
  ButtonDropdown,
  Card,
  CardBlock,
  CardSubtitle,
  CardText,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { Sidebar } from '../../sidebar';
import { IRealmSidebarContainerProps } from './RealmSidebarContainer';

export const RealmSidebar = ({ isOpen }: IRealmSidebarContainerProps) => {
  return (
    <Sidebar isOpen={isOpen}>
      <Card className="Sidebar__Card">
        <CardBlock className="Sidebar__Top">
          <CardTitle className="Sidebar__Title">
            <span title="Test">Test</span>
          </CardTitle>
        </CardBlock>
        <CardBlock className="Sidebar__Tables" />
        <CardBlock className="Sidebar__Controls">
          <Button size="sm" color="danger" disabled>
            Delete
          </Button>
        </CardBlock>
      </Card>
    </Sidebar>
  );
};
