import * as React from 'react';
import { Table } from 'reactstrap';
import * as Realm from 'realm';

import * as ros from '../../../../services/ros';
import { displayUser } from '../../utils';

import '../../shared/Sidebar/SidebarTable.scss';
import { PermissionsBadge } from './PermissionsBadge';
import './PermissionsTable.scss';

export const PermissionsTable = ({
  permissions,
}: {
  permissions: Realm.Results<ros.IPermission>;
}) => (
  <Table size="sm" className="SidebarTable">
    <thead>
      <tr>
        <th>User permissions</th>
        <th className="PermissionsTable__PermissionsCell" />
      </tr>
    </thead>
    <tbody>
      {permissions.length === 0 ? (
        <tr>
          <td colSpan={2} className="SidebarTable__EmptyExplanation">
            This realm has no permissions
          </td>
        </tr>
      ) : (
        permissions.map((permission, index) => (
          <tr key={index}>
            <td>{displayUser(permission.user, 'public')}</td>
            <td>
              <PermissionsBadge
                isVisible={permission.mayRead}
                label="R"
                title="May read"
              />
              <PermissionsBadge
                isVisible={permission.mayWrite}
                label="W"
                title="May write"
              />
              <PermissionsBadge
                isVisible={permission.mayManage}
                label="M"
                title="May manage"
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  </Table>
);
