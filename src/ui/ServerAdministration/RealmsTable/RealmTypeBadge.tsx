import * as React from 'react';
import { Badge } from 'reactstrap';

import * as ros from '../../../services/ros';

export interface IRealmTypeBadge {
  className?: string;
  type?: ros.RealmType;
  short?: boolean;
}

const getColor = (type?: ros.RealmType) => {
  if (type === 'reference') {
    return 'primary';
  } else if (type === 'partial') {
    return 'warning';
  } else {
    return 'secondary';
  }
};

export const RealmTypeBadge = ({
  className,
  type,
  short = false,
}: IRealmTypeBadge) => {
  // Use 'full' if an empty string is passed as type.
  type = type || 'full';
  const color = getColor(type);
  const displayType = short ? type.charAt(0).toUpperCase() : type;
  return (
    <Badge className={className} color={color}>
      <span title={type}>{displayType}</span>
    </Badge>
  );
};
