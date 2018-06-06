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
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import { LogLevel } from '.';
import { LevelIcon } from './LevelIcon';

export const LevelSelector = ({
  className,
  isDropdownOpen,
  onLevelChanged,
  selectedLevel,
  toggle,
}: {
  className?: string;
  isDropdownOpen: boolean;
  onLevelChanged: (level: LogLevel) => void;
  selectedLevel: LogLevel;
  toggle: () => void;
}) => {
  return (
    <ButtonDropdown
      size="sm"
      direction="up"
      className={className}
      isOpen={isDropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle caret={true}>{selectedLevel}</DropdownToggle>
      <DropdownMenu right={true}>
        {Object.keys(LogLevel).map(level => (
          <DropdownItem
            key={level}
            onClick={() => onLevelChanged(level as LogLevel)}
          >
            {level}
            <LevelIcon
              className="Log__LevelSelector__Icon"
              level={level as LogLevel}
            />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </ButtonDropdown>
  );
};
