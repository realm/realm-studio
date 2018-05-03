import * as React from 'react';
import { Badge } from 'reactstrap';

interface IPermissionsBadgeProps {
  isVisible: boolean;
  label: string;
  title: string;
}

export const PermissionsBadge = ({
  isVisible,
  label,
  title,
}: IPermissionsBadgeProps) =>
  isVisible ? (
    <Badge className="PermissionsTable__PermissionsCell__Badge">
      <span title={title}>{label}</span>
    </Badge>
  ) : null;
