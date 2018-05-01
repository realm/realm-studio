import * as React from 'react';
import {
  Button,
  ButtonDropdown,
  Card,
  CardBlock,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import * as ros from '../../../../services/ros';

import { Sidebar } from '../../shared/Sidebar';
import { IUserSidebarContainerProps } from './';
import { AccountsTable } from './AccountsTable';
import { MetadataTable } from './MetadataTable';
import { RealmsTable } from './RealmsTable';

export interface IUserSidebarProps extends IUserSidebarContainerProps {
  onChangePassword: () => void;
  onDeletion: () => void;
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
  onRoleChanged: (role: ros.UserRole) => void;
  onToggle: () => void;
  roleDropdownOpen: boolean;
  toggleRoleDropdown: () => void;
}

export const UserSidebar = ({
  isOpen,
  onChangePassword,
  onDeletion,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
  onRoleChanged,
  onToggle,
  realms,
  roleDropdownOpen,
  toggleRoleDropdown,
  user,
}: IUserSidebarProps) => {
  return (
    <Sidebar isOpen={isOpen}>
      {user && (
        <Card className="Sidebar__Card">
          <CardBlock className="Sidebar__Top">
            <CardTitle className="Sidebar__Title">
              <span className="Sidebar__TitleText" title={user.userId}>
                {user.userId}
              </span>
              <i
                onClick={onToggle}
                className="Sidebar__TitleToggle fa fa-close"
              />
            </CardTitle>
            <ButtonDropdown
              isOpen={roleDropdownOpen}
              toggle={toggleRoleDropdown}
            >
              <DropdownToggle caret={true}>
                {user.isAdmin ? 'Administrator' : 'Regular user'}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => onRoleChanged(ros.UserRole.Administrator)}
                >
                  Administrator
                </DropdownItem>
                <DropdownItem
                  onClick={() => onRoleChanged(ros.UserRole.Regular)}
                >
                  Regular user
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </CardBlock>
          <CardBlock className="Sidebar__Tables">
            <AccountsTable accounts={user.accounts} />
            <MetadataTable
              metadatas={user.metadata}
              onMetadataAppended={onMetadataAppended}
              onMetadataChanged={onMetadataChanged}
              onMetadataDeleted={onMetadataDeleted}
            />
            <RealmsTable realms={realms} />
          </CardBlock>
          <CardBlock className="Sidebar__Controls">
            <Button size="sm" onClick={() => onChangePassword()}>
              Change password
            </Button>
            <Button size="sm" color="danger" onClick={() => onDeletion()}>
              Delete
            </Button>
          </CardBlock>
        </Card>
      )}
    </Sidebar>
  );
};
