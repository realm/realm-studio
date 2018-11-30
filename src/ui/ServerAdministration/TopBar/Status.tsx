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
import * as Realm from 'realm';

import { ILoadingProgress, LoadingStatus } from '../../reusable/LoadingOverlay';
import { RealmAdminConnection } from '../AdminRealm';

import { ConnectionStateIndicator } from './ConnectionStateIndicator';
import { VersionBadge } from './VersionBadge';

export interface IStatusProps {
  onReconnect: () => void;
  progress: ILoadingProgress;
  user: Realm.Sync.User | null;
  serverVersion?: string;
}

function renderText(prefix: string, selectable: string = '') {
  return (
    <React.Fragment>
      {prefix}
      <span className="TopBar__Status__selectable">{selectable}</span>
    </React.Fragment>
  );
}

function renderStatus(
  connectionState: Realm.Sync.ConnectionState,
  status: LoadingStatus,
  message?: string,
  serverUrl?: string,
) {
  if (connectionState === Realm.Sync.ConnectionState.Connected) {
    return renderText(serverUrl ? 'Connected to ' : 'Connected', serverUrl);
  } else if (connectionState === Realm.Sync.ConnectionState.Connecting) {
    return renderText(serverUrl ? 'Connecting to ' : 'Connecting', serverUrl);
  } else if (
    connectionState === Realm.Sync.ConnectionState.Disconnected &&
    status === 'done'
  ) {
    return renderText(
      serverUrl ? 'Disconnected from ' : 'Disconnected',
      serverUrl,
    );
  } else if (status === 'failed') {
    // We could include the message, but that is usually very long and its shown on the LoadingOverlay anyway
    return 'Failed';
  } else if (status === 'in-progress') {
    return message || 'Loading';
  } else if (status === 'done') {
    return message || 'Authenticated';
  } else {
    return message || 'Waiting';
  }
}

export const Status = ({
  progress: { status, message },
  user,
  serverVersion,
}: IStatusProps) => {
  return (
    <RealmAdminConnection>
      {connectionState => (
        <React.Fragment>
          <p className="TopBar__Status">
            {renderStatus(
              connectionState,
              status,
              message,
              user ? user.server : undefined,
            )}
          </p>
          <VersionBadge serverVersion={serverVersion} />
          <ConnectionStateIndicator
            className="TopBar__Status__Icon"
            connectionState={connectionState}
          />
        </React.Fragment>
      )}
    </RealmAdminConnection>
  );
};
