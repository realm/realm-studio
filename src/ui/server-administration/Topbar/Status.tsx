import * as React from 'react';
import { Button } from 'reactstrap';
import * as Realm from 'realm';

import { ILoadingProgress } from '../../reusable/loading-overlay';

export interface IStatusProps {
  onReconnect: () => void;
  progress: ILoadingProgress;
  user: Realm.Sync.User | null;
}

export const Status = ({ onReconnect, progress, user }: IStatusProps) => {
  if (user) {
    if (progress.status === 'failed') {
      return (
        <p className="ServerAdministration__Status">
          <i className="fa fa-exclamation-circle" /> Disconnected: "
          <span className="ServerAdministration__Status__error">
            {progress.message}
          </span>"&nbsp;
          {/* progress.retry ? (
            <Button size="sm" onClick={progress.retry.onRetry}>
              Reconnect now
            </Button>
          ) : null */}
        </p>
      );
    } else if (progress.status === 'in-progress') {
      return (
        <p className="ServerAdministration__Status">
          Connecting to&nbsp;
          <span className="ServerAdministration__Status__server">
            {user.server}
          </span>
        </p>
      );
    } else if (progress.status === 'done') {
      return (
        <p className="ServerAdministration__Status">
          Connected to&nbsp;
          <span className="ServerAdministration__Status__server">
            {user.server}
          </span>
        </p>
      );
    } else {
      return (
        <p className="ServerAdministration__Status">
          <i className="fa fa-exclamation-circle" /> Not connected
        </p>
      );
    }
  } else {
    return <p className="ServerAdministration__Status">Authenticating ...</p>;
  }
};
