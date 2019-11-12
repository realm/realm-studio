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

import React from 'react';
import { Tooltip } from 'reactstrap';

import { Action } from '../../..';

export interface IDescription {
  enabled: string;
  disabled: string;
}

function getActionLetter(action: Action) {
  switch (action) {
    case 'canRead':
      return 'R';
    case 'canUpdate':
      return 'U';
    case 'canDelete':
      return 'D';
    case 'canSetPermissions':
      return 'P';
    case 'canQuery':
      return 'Q';
    case 'canCreate':
      return 'C';
    case 'canModifySchema':
      return 'S';
  }
}

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

interface IActionCellProps {
  action: Action;
  description: string | IDescription;
  element: HTMLElement | null;
  onRef: (element: HTMLElement | null) => void;
  onToggleTooltip: () => void;
  isTooltipOpen: boolean;
}

export const ActionCell = ({
  action,
  description,
  element,
  isTooltipOpen,
  onToggleTooltip,
  onRef,
}: IActionCellProps) => (
  <th className="PermissionTable__ActionHeaderCell" key={action} ref={onRef}>
    {getActionLetter(action)}
    {element ? (
      <Tooltip
        isOpen={isTooltipOpen}
        toggle={onToggleTooltip}
        target={element}
        placement="bottom"
      >
        <strong>{getActionLabel(action)}</strong>
        <br />
        {typeof description === 'string' ? (
          description
        ) : (
          <React.Fragment>
            <em>Enabled:</em> {description.enabled}
            <br />
            <em>Disabled:</em> {description.disabled}
          </React.Fragment>
        )}
      </Tooltip>
    ) : null}
  </th>
);
