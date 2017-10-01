import * as os from 'os';
import * as React from 'react';
import { Button } from 'reactstrap';

import { IUpdateStatus } from '../../main/updater';

import realmLogo from 'realm-studio-svgs/realm-logo.svg';
import { HistoryPanelContainer } from './HistoryPanelContainer';
import { UpdateStatusIndicator } from './UpdateStatusIndicator';

import './Greeting.scss';

export const Greeting = ({
  isSyncEnabled,
  onConnectToServer,
  onOpenLocalRealm,
  updateStatus,
  version,
}: {
  isSyncEnabled: boolean;
  onConnectToServer: () => void;
  onOpenLocalRealm: () => void;
  updateStatus: IUpdateStatus;
  version: string;
}) => (
  <div className="Greeting">
    <div className="Greeting__ActionsPanel">
      <div className="Greeting__Brand">
        <svg viewBox={realmLogo.viewBox} className="Greeting__Logo">
          <use xlinkHref={realmLogo.url} />
        </svg>
        <h3 className="Greeting__Title">Realm Studio</h3>
        <p>
          Version {version}
          {updateStatus && <UpdateStatusIndicator status={updateStatus} />}
        </p>
      </div>
      <div className="Greeting__Actions">
        <Button className="Greeting__Action" onClick={onOpenLocalRealm}>
          Open a local Realm
        </Button>
        <Button
          className="Greeting__Action"
          onClick={onConnectToServer}
          disabled={!isSyncEnabled}
          title={
            isSyncEnabled
              ? 'Click to connect to Realm Object Server'
              : `This feature is currently not available on ${os.type()}`
          }
        >
          Connect to Realm Object Server
        </Button>
      </div>
    </div>
    <HistoryPanelContainer />
  </div>
);
