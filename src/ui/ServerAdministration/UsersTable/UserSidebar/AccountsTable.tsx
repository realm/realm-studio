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

import React from 'react';

import * as ros from '../../../../services/ros';
import { SidebarTable } from '../../../reusable';

export const AccountsTable = ({ accounts }: { accounts: ros.IAccount[] }) => (
  <SidebarTable size="sm">
    <thead>
      <tr>
        <th>ID</th>
        <th>Provider</th>
      </tr>
    </thead>
    <tbody>
      {accounts.length === 0 ? (
        <tr>
          <td colSpan={2} className="AccountsTable__EmptyExplanation">
            This user has no accounts
          </td>
        </tr>
      ) : (
        accounts.map(account => {
          return (
            <tr key={`${account.provider}+${account.providerId}+`}>
              <td>{account.providerId}</td>
              <td>{account.provider}</td>
            </tr>
          );
        })
      )}
    </tbody>
  </SidebarTable>
);
