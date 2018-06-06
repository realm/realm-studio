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
import { Table } from 'reactstrap';
import * as Realm from 'realm';

import * as ros from '../../../../../services/ros';
import { displayUser } from '../../../utils';

import { PermissionsBadge } from './PermissionsBadge';
import './PermissionsTable.scss';

export const PermissionsTable = ({
  permissions,
}: {
  permissions: Realm.Results<ros.IPermission>;
}) => (
  <Table size="sm" className="PermissionsTable">
    <thead>
      <tr>
        <th>User permissions</th>
        <th className="PermissionsTable__PermissionsCell" />
      </tr>
    </thead>
    <tbody>
      {permissions.length === 0 ? (
        <tr>
          <td colSpan={2} className="PermissionsTable__EmptyExplanation">
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
