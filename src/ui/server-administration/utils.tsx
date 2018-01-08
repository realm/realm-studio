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

const userIdPattern = /[0-9a-fA-F]{32}/;

export const shortenRealmPath = (path: string) => {
  const userIdMatch = userIdPattern.exec(path);
  if (userIdMatch) {
    const userId = userIdMatch[0];
    const shortUserId = '~';
    return path.replace(userId, shortUserId);
  } else {
    return path;
  }
};

export const querySomeFieldContainsText = (
  fields: string[],
  textToContain: string,
) =>
  fields.map(field => `${field} CONTAINS[c] "${textToContain}"`).join(' OR ');
