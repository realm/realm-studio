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
import * as ros from '../../services/ros';

export { wait, prettyBytes } from '../../utils';

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
): string => {
  // If query starts with !, just execute as is
  if (textToContain.indexOf('!') === 0) {
    return textToContain.substring(1);
  } else {
    return fields
      .map(field => `${field} CONTAINS[c] "${textToContain}"`)
      .join(' OR ');
  }
};
