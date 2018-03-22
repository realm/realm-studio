import * as moment from 'moment';
import * as React from 'react';
import { Badge } from 'reactstrap';

const calendarFormats = {
  // See https://momentjs.com/docs/#localized-formats
  sameDay: 'LTS',
};

export interface ITimestampBadgeProps {
  className?: string;
  timestamp: string;
}

export const TimestampBadge = ({
  className,
  timestamp,
}: ITimestampBadgeProps) => {
  return (
    <Badge color="default" className={className}>
      <span unselectable={true} title={timestamp}>
        {moment(timestamp).calendar(undefined, calendarFormats)}
      </span>
    </Badge>
  );
};
