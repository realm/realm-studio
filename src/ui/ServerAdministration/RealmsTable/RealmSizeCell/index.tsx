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

import { MetricGetter, RealmFile } from '..';
import { RealmSize } from '../RealmSize';

import './RealmSizeCell.scss';

interface IRealmSizeCellProps {
  getMetric: MetricGetter;
  realm: RealmFile;
}

export const RealmSizeCell = ({ realm, getMetric }: IRealmSizeCellProps) => {
  const stateSize = getMetric(realm, 'RealmStateSize');
  const fileSize = getMetric(realm, 'RealmFileSize');
  return (
    <div className="RealmSizeCell">
      <span className="RealmSizeCell__FileSize">
        <RealmSize metric={fileSize} title="File size" />
      </span>
      <span className="RealmSizeCell__StateSize">
        (<RealmSize metric={stateSize} title="State size" /> data)
      </span>
    </div>
  );
};
