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

import classNames from 'classnames';
import React from 'react';
import { Badge } from 'reactstrap';

import { LogLevel } from '.';
import { ContextInspector } from './ContextInspector';
import { LevelIcon } from './LevelIcon';
import { TimestampBadge } from './TimestampBadge';

export interface ILogEntry {
  level: LogLevel;
  message: string;
  context: { [key: string]: string };
}

export interface IEntryProps extends ILogEntry {
  style: any;
  onResized: () => void;
}

export const Entry = ({
  context,
  level,
  message,
  style,
  onResized,
}: IEntryProps) => {
  // Timestamp and service are considered special enough to be promoted to badges
  const { timestamp, service, ...restOfContext } = context;
  return (
    <div
      className={classNames('Log__Entry', `Log__Entry--${level}`)}
      style={style}
    >
      <div className="Log__Entry__Level" title={level}>
        <LevelIcon level={level} />
      </div>
      <div className="Log__Entry__Rows">
        <div className="Log__Entry__Row">
          <span className="Log__Entry__Message">{message}</span>
          <div className="Log__Entry__Badges">
            {service ? (
              <Badge className="Log__Entry__Badge" color="secondary">
                <span title="service">{service}</span>
              </Badge>
            ) : null}
            {timestamp ? (
              <TimestampBadge
                className="Log__Entry__Badge"
                timestamp={timestamp}
              />
            ) : null}
          </div>
        </div>
        {Object.keys(restOfContext).length > 0 ? (
          <div className="Log__Entry__Context">
            <ContextInspector context={context} onUpdated={onResized} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
