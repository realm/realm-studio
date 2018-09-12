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
import { Badge } from 'reactstrap';

import { IPermission } from '.';
import { Action } from './models';

function getActionLabel(action: Action) {
  switch (action) {
    case 'canRead':
      return 'Read';
    case 'canUpdate':
      return 'Update';
    case 'canDelete':
      return 'Delete';
    case 'canSetPermissions':
      return 'Set Permissions';
    case 'canQuery':
      return 'Query';
    case 'canCreate':
      return 'Create';
    case 'canModifySchema':
      return 'Modify Schema';
  }
}

interface IActionBadgeProps {
  action: Action;
  description?: string;
  permission: IPermission;
}

export const ActionBadge = ({
  action,
  description,
  permission,
}: IActionBadgeProps) =>
  permission[action] ? (
    <Badge title={description}>{getActionLabel(action)}</Badge>
  ) : null;
