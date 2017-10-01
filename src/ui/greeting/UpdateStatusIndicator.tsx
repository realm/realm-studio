import * as React from 'react';
import { Badge } from 'reactstrap';

import { IUpdateStatus } from '../../main/updater';

import { LoadingDots } from '../reusable/loading-dots/LoadingDots';

export const UpdateStatusIndicator = ({
  status,
}: {
  status: IUpdateStatus;
}) => (
  <span className="Greeting__UpdateStatusIndicator">
    {status.checking && (
      <LoadingDots className="Greeting__UpdateStatusIndicator__dots" />
    )}
    {status.available === true && (
      <i
        className="Greeting__UpdateStatusIndicator__icon fa fa-arrow-circle-up"
        aria-hidden="true"
        title="A newer version is available"
      />
    )}
    {status.available === false && (
      <i
        className="Greeting__UpdateStatusIndicator__icon fa fa-check-circle"
        aria-hidden="true"
        title="This is the latest version"
      />
    )}
    {status.error && (
      <i
        className="Greeting__UpdateStatusIndicator__icon fa fa-exclamation-circle"
        aria-hidden="true"
        title={`Error occurred while updating:\n${status.error}`}
      />
    )}
  </span>
);
