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
import {
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardTitle,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import * as ros from '../../../../services/ros';

import { ISelection } from '..';
import { Sidebar } from '../../shared/Sidebar';

import { IUserSidebarContainerProps } from '.';
import { AccountsTable } from './AccountsTable';
import { MetadataTable } from './MetadataTable';
import { RealmsTable } from './RealmsTable';

import './UserSidebar.scss';

export interface IUserSidebarCardProps {
  onChangePassword: () => void;
  onDeletion: () => void;
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
  onRoleChanged: (role: ros.UserRole) => void;
  roleDropdownOpen: boolean;
  selection: ISelection;
  toggleRoleDropdown: () => void;
}

export const UserSidebarCard = ({
  onChangePassword,
  onDeletion,
  onMetadataAppended,
  onMetadataChanged,
  onMetadataDeleted,
  onRoleChanged,
  roleDropdownOpen,
  selection,
  toggleRoleDropdown,
}: IUserSidebarCardProps) => {
  return (
    <Card className="UserSidebar__Card">
      <CardBody className="UserSidebar__Top">
        <CardTitle className="UserSidebar__Title">
          <span
            className="UserSidebar__TitleText"
            title={selection.user.userId}
          >
            {selection.user.userId}
          </span>
        </CardTitle>
        <ButtonDropdown isOpen={roleDropdownOpen} toggle={toggleRoleDropdown}>
          <DropdownToggle caret={true}>
            {selection.user.isAdmin ? 'Administrator' : 'Regular user'}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => onRoleChanged(ros.UserRole.Administrator)}
            >
              Administrator
            </DropdownItem>
            <DropdownItem onClick={() => onRoleChanged(ros.UserRole.Regular)}>
              Regular user
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </CardBody>
      <CardBody className="UserSidebar__Tables">
        <AccountsTable accounts={selection.user.accounts} />
        <MetadataTable
          metadatas={selection.user.metadata}
          onMetadataAppended={onMetadataAppended}
          onMetadataChanged={onMetadataChanged}
          onMetadataDeleted={onMetadataDeleted}
        />
        <RealmsTable realms={selection.realms} />
      </CardBody>
      <CardBody className="UserSidebar__Controls">
        <Button size="sm" onClick={() => onChangePassword()}>
          Change password
        </Button>
        <Button size="sm" color="danger" onClick={() => onDeletion()}>
          Delete
        </Button>
      </CardBody>
    </Card>
  );
};
