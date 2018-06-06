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

import { ILoadingProgress } from '../../reusable/LoadingOverlay';

export interface IStatusProps {
  onReconnect: () => void;
  progress: ILoadingProgress;
  user: Realm.Sync.User | null;
}

export const Status = ({ onReconnect, progress, user }: IStatusProps) => {
  if (user) {
    if (progress.status === 'failed') {
      return (
        <p className="TopBar__Status">
          <i className="fa fa-exclamation-circle" /> Disconnected: "
          <span className="TopBar__Status__error">
            {progress.message}
          </span>"&nbsp;
          {/* progress.retry ? (
            <Button size="sm" onClick={progress.retry.onRetry}>
              Reconnect now
            </Button>
          ) : null */}
        </p>
      );
    } else if (progress.status === 'in-progress') {
      return (
        <p className="TopBar__Status">
          Connecting to&nbsp;
          <span className="TopBar__Status__server">{user.server}</span>
        </p>
      );
    } else if (progress.status === 'done') {
      return (
        <p className="TopBar__Status">
          Connected to&nbsp;
          <span className="TopBar__Status__server">{user.server}</span>
        </p>
      );
    } else {
      return (
        <p className="TopBar__Status">
          <i className="fa fa-exclamation-circle" /> Not connected
        </p>
      );
    }
  } else {
    return <p className="TopBar__Status">Authenticating ...</p>;
  }
};
