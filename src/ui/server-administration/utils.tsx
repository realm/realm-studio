import * as React from 'react';
import * as ros from '../../services/ros';

export const displayUser = (user: ros.IUser | null) =>
  user ? (
    <span title={`ID: ${user.userId}`}>
      {user.accounts.map(account => (
        <span title={account.provider}>{account.providerId}</span>
      ))}
    </span>
  ) : (
    <span>nobody</span>
  );
