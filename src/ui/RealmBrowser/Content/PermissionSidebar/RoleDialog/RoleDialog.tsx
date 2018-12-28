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
import { Badge, Modal, ModalBody, ModalHeader } from 'reactstrap';

import { IRole, IUser } from '..';

import './RoleDialog.scss';
import { UserList } from './UserList';

function determineIsUserRole(role: IRole, members: IUser[]) {
  if (members.length === 1) {
    const user = members[0];
    return user.role && user.role.name === role.name;
  } else {
    return false;
  }
}

type RoleType = 'everyone' | 'user' | 'regular';
function determineType(role: IRole, members: IUser[]): RoleType {
  if (role && role.name === 'everyone') {
    return 'everyone';
  } else if (role && determineIsUserRole(role, members)) {
    return 'user';
  } else {
    return 'regular';
  }
}

function getDescription(type: RoleType | undefined) {
  if (type === 'everyone') {
    return 'All users are assigned this role.';
  } else if (type === 'user') {
    return 'Only a single user is assigned to this role.';
  } else if (type === 'regular') {
    return 'Users assigned this role:';
  } else {
    return null;
  }
}

interface IRoleDialogBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IRoleDialogOpenedProps extends IRoleDialogBaseProps {
  isOpen: true;
  role: IRole;
}

interface IRoleDialogClosedProps extends IRoleDialogBaseProps {
  isOpen: false;
}

export type IRoleDialogProps = IRoleDialogOpenedProps | IRoleDialogClosedProps;

export const RoleDialog = (props: IRoleDialogProps) => {
  // Create a set of member ids to remove any duplicates
  const members: IUser[] = [];
  if (props.isOpen) {
    for (const member of props.role.members) {
      // Add the member to the list if it's not already there
      if (!members.find(m => m.id === member.id)) {
        members.push(member);
      }
    }
  }
  // Is this one of the special automatically created user roles?
  const type = props.isOpen ? determineType(props.role, members) : undefined;
  const isSystem = type === 'everyone' || type === 'user';
  return (
    <Modal className="RoleDialog" isOpen={props.isOpen} toggle={props.onClose}>
      <ModalHeader className="RoleDialog__Header" tag="h6">
        <code>{props.isOpen ? props.role.name : null}</code>
        <Badge
          className="RoleDialog__TypeBadge"
          color={isSystem ? 'primary' : 'secondary'}
        >
          {isSystem ? 'System role' : 'Role'}
        </Badge>
      </ModalHeader>
      <ModalBody>
        <p>{getDescription(type)}</p>
        {isSystem ? null : <UserList members={members} />}
      </ModalBody>
    </Modal>
  );
};
