import * as React from 'react';
import { Badge } from 'reactstrap';

export interface IVersionBadgeProps {
  serverVersion?: string;
}

export const VersionBadge = ({ serverVersion }: IVersionBadgeProps) => {
  return serverVersion ? (
    <Badge className="TopBar__VersionBadge">
      <span title={`Server is version ${serverVersion}`}>v{serverVersion}</span>
    </Badge>
  ) : null;
};
