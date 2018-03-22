import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { Badge } from 'reactstrap';

import { LogLevel } from '.';
import { ContextInspector } from './ContextInspector';
import { LevelIcon } from './LevelIcon';

const calendarFormats = {
  // See https://momentjs.com/docs/#localized-formats
  sameDay: 'LTS',
};

const TimestampBadge = ({ timestamp }: { timestamp: string }) => {
  return (
    <Badge color="default" className="Log__Entry__Badge">
      <span unselectable={true} title={timestamp}>
        {moment(timestamp).calendar(undefined, calendarFormats)}
      </span>
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
  onResized: () => void;
}

export const Entry = ({
  context,
  level,
  message,
  style,
  onResized,
}: IEntryProps) => {
  const { timestamp, ...restOfContext } = context;
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
            {timestamp ? <TimestampBadge timestamp={timestamp} /> : null}
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
