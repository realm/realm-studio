import * as moment from "moment";
import * as React from "react";
import { Badge } from "reactstrap";

import { LogLevel } from "./LevelSelector";

const calendarFormats = {
  // See https://momentjs.com/docs/#localized-formats
  sameDay: "LTS",
};

const levelColors: { [level: string]: string } = {
  fatal: "danger",
  error: "danger",
  warn: "warning",
  info: "info",
  detail: "default",
  debug: "default",
  trace: "default",
};

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
  const color = levelColors[level] || "default";
  return (
    <Badge color={color} className="Log__Entry__Badge">
      <span unselectable={true} >
        {level}
      </span>
    </Badge>
  );
};

const ContextBadge = ({ contextKey, contextValue }: { contextKey: string, contextValue: string }) => {
  return (
    <Badge color="default" className="Log__Entry__Badge">
      { contextKey === "timestamp" ? (
        <span
          title={`${contextKey}: ${moment(contextValue).toISOString()}`}
          unselectable={true}
        >
          {moment(contextValue).calendar(undefined, calendarFormats)}
        </span>
      ) : (
        <span
          title={contextKey}
          unselectable={true}
        >
           {contextValue}
        </span>
      )}
    </Badge>
  );
};

export interface ILogEntry {
  level: LogLevel;
  message: string;
  context: { [key: string]: string };
}

export interface IEntryProps extends ILogEntry {
  style: any;
}

export const Entry = ({
  context,
  level,
  message,
  style,
}: IEntryProps) => {
  return (
    <div className="Log__Entry" style={style}>
      <span className="Log__Entry__Message">{message}</span>
      <div className="Log__Entry__Badges">
        {Object.keys(context || {}).map((key) => (
          <ContextBadge key={key} contextKey={key} contextValue={context[key]} />
        ))}
        <LogLevelBadge level={level} />
      </div>
    </div>
  );
};
