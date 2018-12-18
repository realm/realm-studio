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
import * as Realm from 'realm';

import './ConnectionStateIndicator.scss';

import connectionStateSvg from '../../../../../static/svgs/connection-state.svg';

export interface IConnectionStateIndicatorProps {
  className?: string;
  connectionState: Realm.Sync.ConnectionState;
}

export const ConnectionStateIndicator = ({
  className,
  connectionState,
}: IConnectionStateIndicatorProps) => (
  <svg
    viewBox={connectionStateSvg.viewBox}
    className={classNames(
      'ConnectionStateIndicator',
      `ConnectionStateIndicator--${connectionState}`,
      className,
    )}
  >
    <use xlinkHref={`#${connectionStateSvg.id}`} />
  </svg>
);
