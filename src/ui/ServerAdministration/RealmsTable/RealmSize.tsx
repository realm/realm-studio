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

import { prettyBytes } from '../utils';

import { MissingSizeBadge } from './MissingSizeBadge';

interface IRealmSizeProps {
  size?: number;
  title: string;
  suffix?: string;
}

export const RealmSize = ({ size, title, suffix }: IRealmSizeProps) => (
  <span title={title}>
    {size ? prettyBytes(size) : <MissingSizeBadge />}
    {suffix ? ` ${suffix}` : null}
  </span>
);
