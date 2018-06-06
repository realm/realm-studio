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

import * as ros from '../../../../services/ros';
import { shortenRealmPath } from '../../utils';

import './RealmsTable.scss';

export const RealmsTable = ({
  realms,
}: {
  realms: Realm.Results<ros.IRealmFile>;
}) => (
  <Table size="sm" className="RealmsTable">
    <thead>
      <tr>
        {/* We mention "Realm" in this header, so we don't need a separate header */}
        <th>Realm path</th>
      </tr>
    </thead>
    <tbody>
      {realms.length === 0 ? (
        <tr>
          <td colSpan={1} className="RealmsTable__EmptyExplanation">
            This user has no realms
          </td>
        </tr>
      ) : (
        realms.map(realm => {
          return (
            <tr key={realm.path}>
              <td title={realm.path}>{shortenRealmPath(realm.path)}</td>
            </tr>
          );
        })
      )}
    </tbody>
  </Table>
);
