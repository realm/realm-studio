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

interface IRefreshIconProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const showInternalFeatures =
  process.env.REALM_STUDIO_INTERNAL_FEATURES === 'true';

export const RefreshIcon = ({ isRefreshing, onRefresh }: IRefreshIconProps) =>
  showInternalFeatures ? (
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
  ) : null;
