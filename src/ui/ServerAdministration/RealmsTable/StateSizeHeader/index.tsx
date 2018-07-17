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
import { TableHeaderProps } from 'react-virtualized';

import './StateSizeHeader.scss';

// @see https://github.com/bvaughn/react-virtualized/blob/9.18.5/source/Table/defaultHeaderRenderer.js

interface IStateSizeHeaderProps extends TableHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const StateSizeHeader = ({
  label,
  isRefreshing,
  onRefresh,
}: IStateSizeHeaderProps) => (
  <span className="ReactVirtualized__Table__headerTruncatedText">
    {label}
    <i
      className={classNames(
        'StateSizeHeader__RefreshIcon',
        'fa',
        'fa-refresh',
        {
          'StateSizeHeader__RefreshIcon--refreshing': isRefreshing,
          'fa-spin': isRefreshing,
        },
      )}
      onClick={onRefresh}
    />
  </span>
);
