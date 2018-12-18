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

import * as moment from 'moment';
import * as React from 'react';

import { IRealmFileSize, IRealmStateSize } from '../MetricsRealm';
import { prettyBytes } from '../utils';

import { MissingSizeBadge } from './MissingSizeBadge';

interface IRealmSizeProps {
  metric?: IRealmStateSize | IRealmFileSize;
  title: string;
  suffix?: string;
}

export const RealmSize = ({ metric, title, suffix }: IRealmSizeProps) => (
  <span
    title={
      metric ? `${title}, updated ${moment(metric.emitted).fromNow()}` : title
    }
  >
    {metric ? prettyBytes(metric.value) : <MissingSizeBadge />}
    {suffix ? ` ${suffix}` : null}
  </span>
);
