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
      dropup={true}
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
