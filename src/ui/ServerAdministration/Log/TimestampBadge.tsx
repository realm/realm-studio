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

import moment from 'moment';
import React from 'react';
import { Badge } from 'reactstrap';

const calendarFormats = {
  // See https://momentjs.com/docs/#localized-formats
  sameDay: 'LTS',
  nextDay: 'L LTS',
  nextWeek: 'L LTS',
  lastDay: 'L LTS',
  lastWeek: 'L LTS',
  sameElse: 'L LTS',
};

export interface ITimestampBadgeProps {
  className?: string;
  timestamp: string;
}

export const TimestampBadge = ({
  className,
  timestamp,
}: ITimestampBadgeProps) => {
  return (
    <Badge color="secondary" className={className}>
      <span unselectable="on" title={timestamp}>
        {moment(timestamp).calendar(undefined, calendarFormats)}
      </span>
    </Badge>
  );
};
