import * as os from 'os';
import * as React from 'react';
import { Button } from 'reactstrap';
import * as util from 'util';

import { IUpdateStatus } from '../../main/Updater';

import realmLogo from '../../../static/svgs/realm-logo.svg';
import { HistoryPanelContainer } from './HistoryPanelContainer';
import { SignupOverlayContainer } from './SignupOverlayContainer';
import { UpdateStatusIndicator } from './UpdateStatusIndicator';

import './Greeting.scss';

export const Greeting = ({
  isSyncEnabled,
  onCheckForUpdates,
  onConnectToServer,
  onOpenLocalRealm,
  updateStatus,
  version,
}: {
  isSyncEnabled: boolean;
  onCheckForUpdates: () => void;
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
        <div>Version {version}</div>
      </div>
      <UpdateStatusIndicator
        status={updateStatus}
        onCheckForUpdates={onCheckForUpdates}
      />
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
    <SignupOverlayContainer />
  </div>
);
