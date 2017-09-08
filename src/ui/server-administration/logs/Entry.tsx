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
  detail: "secondary",
  debug: "secondary",
  trace: "secondary",
};

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
  const color = levelColors[level] || "default";
  return (
    <Badge color={color} className="Log__Entry__Badge">
      {level}
    </Badge>
  );
};

const ContextBadge = ({ contextKey, contextValue }: { contextKey: string, contextValue: string }) => {
  return (
    <Badge color="default" className="Log__Entry__Badge">
      { contextKey === "timestamp" ? (
        <span title={`${contextKey}: ${moment(contextValue).toISOString()}`}>
           { moment(contextValue).calendar(undefined, calendarFormats) }
        </span>
      ) : (
        <span title={contextKey}>
           { contextValue }
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

export const Entry = ({
  level,
  message,
  context,
}: ILogEntry) => {
  return (
    <div className="Log__Entry">
      <span className="Log__Entry__Message">{message}</span>
      <div className="Log__Entry__Badges">
        { Object.keys(context).map((key) => (
          <ContextBadge key={key} contextKey={key} contextValue={context[key]} />
        )) }
        <LogLevelBadge level={level} />
      </div>
    </div>
  );
};
