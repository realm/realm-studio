import * as React from 'react';
import { Table } from 'reactstrap';

import * as ros from '../../../../services/ros';

export const AccountsTable = ({ accounts }: { accounts: ros.IAccount[] }) => (
  <Table size="sm" className="UserSidebar__AccountsTable">
    <thead>
      <tr>
        <th>ID</th>
        <th>Provider</th>
      </tr>
    </thead>
    <tbody>
      {accounts.length === 0 ? (
        <tr>
          <td colSpan={2} className="UserSidebar__EmptyTableExplanation">
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
  </Table>
);
