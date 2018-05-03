import * as React from 'react';
import { Table } from 'reactstrap';

import * as ros from '../../../../services/ros';

import './AccountsTable.scss';

export const AccountsTable = ({ accounts }: { accounts: ros.IAccount[] }) => (
  <Table size="sm" className="AccountsTable">
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
  </Table>
);
