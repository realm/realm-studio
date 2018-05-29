import * as React from 'react';

import * as ros from '../../../../services/ros';

import { ISelection } from '..';
import { Sidebar } from '../../shared/Sidebar';

import { IUserSidebarContainerProps } from '.';
import { UserSidebarCard } from './UserSidebarCard';

import './UserSidebar.scss';

export interface IUserSidebarProps extends IUserSidebarContainerProps {
  onChangePassword: () => void;
  onDeletion: () => void;
  onMetadataAppended: () => void;
  onMetadataChanged: (index: number, key: string, value: string) => void;
  onMetadataDeleted: (index: number) => void;
  onRoleChanged: (role: ros.UserRole) => void;
  onToggle: () => void;
  roleDropdownOpen: boolean;
  selection: ISelection | null;
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
  roleDropdownOpen,
  selection,
  toggleRoleDropdown,
}: IUserSidebarProps) => {
  // We need this type-hax because we don't want the IRealmFile to have a isValid method when it gets created
  const currentUser = selection
    ? ((selection.user as any) as ros.IUser & Realm.Object)
    : null;
  return (
    <Sidebar className="UserSidebar" isOpen={isOpen} onToggle={onToggle}>
      {selection &&
        currentUser &&
        currentUser.isValid() && (
          <UserSidebarCard
            onChangePassword={onChangePassword}
            onDeletion={onDeletion}
            onMetadataAppended={onMetadataAppended}
            onMetadataChanged={onMetadataChanged}
            onMetadataDeleted={onMetadataDeleted}
            onRoleChanged={onRoleChanged}
            roleDropdownOpen={roleDropdownOpen}
            selection={selection}
            toggleRoleDropdown={toggleRoleDropdown}
          />
        )}
    </Sidebar>
  );
};
