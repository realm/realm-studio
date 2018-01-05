import * as React from 'react';
import * as ros from '../../services/ros';

export const displayUser = (
  user: ros.IUser | null,
  fallback: string = 'nobody',
) =>
  user ? (
    <span title={`ID: ${user.userId}`}>
      {user.accounts.map((account, index) => (
        <span key={index} title={account.provider}>
          {account.providerId}
        </span>
      ))}
    </span>
  ) : (
    <span>
      <em>{fallback}</em>
    </span>
  );

export const querySomeFieldContainsText = (
  fields: string[],
  textToContain: string,
) =>
  fields.map(field => `${field} CONTAINS[c] "${textToContain}"`).join(' OR ');
