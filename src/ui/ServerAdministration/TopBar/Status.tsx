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

export interface IStatusProps {
  onReconnect: () => void;
  progress: ILoadingProgress;
  user: Realm.Sync.User | null;
}

function renderText(
  prefix: string,
  selectable: string = '',
  suffix: string = '',
  icon?: string,
) {
  return (
    <React.Fragment>
      {prefix}
      <span className="TopBar__Status__selectable">{selectable}</span>
      {suffix}
      {icon ? <i className={`TopBar__Status__Icon fa fa-${icon}`} /> : null}
    </React.Fragment>
  );
}

function renderConnectionStateMessage(
  connectionState: Realm.Sync.ConnectionState,
  serverUrl?: string,
) {
  if (connectionState === Realm.Sync.ConnectionState.Connected) {
    return renderText(serverUrl ? 'Connected to ' : 'Connected', serverUrl);
  } else if (connectionState === Realm.Sync.ConnectionState.Connecting) {
    return renderText(serverUrl ? 'Connecting to ' : 'Connecting', serverUrl);
  } else if (connectionState === Realm.Sync.ConnectionState.Disconnected) {
    return renderText(
      serverUrl ? 'Disconnected from ' : 'Disconnected',
      serverUrl,
    );
  } else {
    return 'Unexpected connection state';
  }
}
function renderConnectionState(
  connectionState: Realm.Sync.ConnectionState,
  serverUrl?: string,
  message?: string,
) {
  return (
    <React.Fragment>
      {message
        ? renderText(message)
        : renderConnectionStateMessage(connectionState, serverUrl)}
      <ConnectionStateIndicator
        className="TopBar__Status__Icon"
        connectionState={connectionState}
      />
    </React.Fragment>
  );
}

function renderStatus(
  status: LoadingStatus,
  message?: string,
  serverUrl?: string,
) {
  if (status === 'failed') {
    return renderConnectionState(
      Realm.Sync.ConnectionState.Disconnected,
      serverUrl,
    );
  } else if (status === 'in-progress') {
    return renderConnectionState(
      Realm.Sync.ConnectionState.Connecting,
      serverUrl,
      message || 'Loading',
    );
  } else if (status === 'done') {
    return (
      <RealmAdminConnection>
        {connectionState => renderConnectionState(connectionState, serverUrl)}
      </RealmAdminConnection>
    );
  } else {
    return renderConnectionState(
      Realm.Sync.ConnectionState.Connecting,
      serverUrl,
      message || 'Waiting',
    );
  }
}

export const Status = ({
  progress: { status, message },
  user,
}: IStatusProps) => {
  return (
    <p className="TopBar__Status">
      {renderStatus(status, message, user ? user.server : undefined)}
    </p>
  );
};
