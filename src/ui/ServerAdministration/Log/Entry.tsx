import * as classNames from 'classnames';
import * as React from 'react';
import { Badge } from 'reactstrap';

import { LogLevel } from '.';
import { ContextInspector } from './ContextInspector';
import { LevelIcon } from './LevelIcon';
import { TimestampBadge } from './TimestampBadge';

export interface ILogEntry {
  level: LogLevel;
  message: string;
  context: { [key: string]: string };
}

export interface IEntryProps extends ILogEntry {
  style: any;
  onResized: () => void;
}

export const Entry = ({
  context,
  level,
  message,
  style,
  onResized,
}: IEntryProps) => {
  // Timestamp and service are considered special enough to be promoted to badges
  const { timestamp, service, ...restOfContext } = context;
  return (
    <div
      className={classNames('Log__Entry', `Log__Entry--${level}`)}
      style={style}
    >
      <div className="Log__Entry__Level" title={level}>
        <LevelIcon level={level} />
      </div>
      <div className="Log__Entry__Rows">
        <div className="Log__Entry__Row">
          <span className="Log__Entry__Message">{message}</span>
          <div className="Log__Entry__Badges">
            {service ? (
              <Badge className="Log__Entry__Badge" color="secondary">
                <span title="service">{service}</span>
              </Badge>
            ) : null}
            {timestamp ? (
              <TimestampBadge
                className="Log__Entry__Badge"
                timestamp={timestamp}
              />
            ) : null}
          </div>
        </div>
        {Object.keys(restOfContext).length > 0 ? (
          <div className="Log__Entry__Context">
            <ContextInspector
              data={context}
              onUpdated={onResized}
              name="context"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
