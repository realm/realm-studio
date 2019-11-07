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

import * as classNames from 'classnames';
import * as React from 'react';
import { Progress } from 'reactstrap';

import { IUpdateStatus } from '../../main/Updater';

const getDisplayText = (status: IUpdateStatus) => {
  switch (status.state) {
    case 'checking':
      return 'Checking for update';
    case 'failed':
      return 'Failed to update';
    case 'up-to-date':
      return 'This is the latest version';
    case 'available':
      return 'A newer version is available';
    case 'downloading':
      return status.nextVersion
        ? `Downloading ${status.nextVersion}`
        : 'Downloading a newer version';
    case 'downloaded':
      return status.nextVersion
        ? `Downloaded ${status.nextVersion}`
        : 'Downloaded a newer version';
    case 'installing':
      return status.nextVersion
        ? `Installing ${status.nextVersion}`
        : 'Installing a newer version';
    default:
      return '';
  }
};

const getIconClass = (status: IUpdateStatus) => {
  switch (status.state) {
    case 'checking':
      return 'fa-refresh';
    case 'failed':
      return 'fa-exclamation-circle';
    case 'up-to-date':
      return 'fa-check-circle';
    case 'available':
      return 'fa-arrow-circle-up';
    case 'downloading':
      return 'fa-cloud-download';
    case 'downloaded':
      return 'fa-cloud-download';
    case 'installing':
      return 'fa-rocket';
    default:
      return 'fa-question-circle';
  }
};

const getIsBusy = (status: IUpdateStatus) => {
  switch (status.state) {
    case 'failed':
    case 'up-to-date':
    case 'available':
      return false;
    default:
      return true;
  }
};

export const UpdateStatusIndicator = ({
  onCheckForUpdates,
  status,
}: {
  onCheckForUpdates: () => void;
  status: IUpdateStatus;
}) => {
  const isBusy = getIsBusy(status);
  const icon = getIconClass(status);
  const text = getDisplayText(status);
  return (
    <div
      className={classNames('Greeting__UpdateStatusIndicator', {
        'Greeting__UpdateStatusIndicator--busy': isBusy,
      })}
      onClick={!isBusy ? onCheckForUpdates : undefined}
    >
      <p className="Greeting__UpdateStatusIndicator__Status">
        <i
          className={classNames(
            'Greeting__UpdateStatusIndicator__Icon',
            'fa',
            icon,
          )}
          aria-hidden="true"
        />
        {text}
      </p>
      <div className="Greeting__UpdateStatusIndicator__Progress">
        {status.progress && (
          <Progress
            className="Greeting__UpdateStatusIndicator__Rail"
            barClassName="Greeting__UpdateStatusIndicator__Bar"
            animated={status.state === 'downloading'}
            color="primary"
            value={status.progress.downloaded}
            max={status.progress.total}
          />
        )}
      </div>
    </div>
  );
};
