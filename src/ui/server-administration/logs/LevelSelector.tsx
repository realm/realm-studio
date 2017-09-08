import * as React from "react";
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export enum LogLevel {
  fatal = "fatal",
  error = "error",
  warn = "warn",
  info = "info",
  detail = "detail",
  debug = "debug",
  trace = "trace",
  all = "all",
}

export const LevelSelector = ({
  className,
  isDropdownOpen,
  onLevelChanged,
  selectedLevel,
  toggle,
}: {
  className?: string,
  isDropdownOpen: boolean,
  onLevelChanged: (level: LogLevel) => void,
  selectedLevel: LogLevel,
  toggle: () => void,
}) => {
  return (
    <ButtonDropdown size="sm" dropup className={className} isOpen={isDropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        {selectedLevel}
      </DropdownToggle>
      <DropdownMenu right={true}>
        {Object.keys(LogLevel).map((level) => (
          <DropdownItem key={level} onClick={() => onLevelChanged(level as LogLevel)}>
            {level}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </ButtonDropdown>
  );
};
