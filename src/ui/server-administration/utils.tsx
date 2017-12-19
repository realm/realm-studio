import * as React from 'react';
import * as ros from '../../services/ros';

export const displayUser = (
  user: ros.IUser | null,
  fallback: string = 'nobody',
) =>
  user ? (
    <span title={`ID: ${user.userId}`}>
      {user.accounts.map(account => (
        <span title={account.provider}>{account.providerId}</span>
      ))}
    </span>
  ) : (
    <span>
      <em>{fallback}</em>
    </span>
  );
