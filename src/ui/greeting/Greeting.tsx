import * as os from 'os';
import * as React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import * as util from 'util';

import { ICloudStatus } from '../../main/CloudManager';
import { IUpdateStatus } from '../../main/Updater';
import { IServerCredentials } from '../../services/ros';

import realmLogo from '../../../static/svgs/realm-logo.svg';
import { CloudOverlayContainer } from './CloudOverlayContainer';
import { HistoryPanelContainer } from './HistoryPanelContainer';
import { SignupOverlayContainer } from './SignupOverlayContainer';
import { UpdateStatusIndicator } from './UpdateStatusIndicator';

import './Greeting.scss';

export const Greeting = ({
  cloudStatus,
  isCloudOverlayActivated,
  isSyncEnabled,
  onAuthenticate,
  onAuthenticated,
  onCheckForUpdates,
  onConnectToDefaultRealmCloud,
  onConnectToServer,
  onOpenLocalRealm,
  updateStatus,
  version,
}: {
  cloudStatus?: ICloudStatus;
  isCloudOverlayActivated: boolean;
  isSyncEnabled: boolean;
  onAuthenticate: () => void;
  onAuthenticated: () => void;
  onCheckForUpdates: () => void;
  onConnectToDefaultRealmCloud: () => void;
  onConnectToServer: () => void;
  onOpenLocalRealm: () => void;
  updateStatus: IUpdateStatus;
  version: string;
}) => (
  <div className="Greeting">
    <div className="Greeting__ActionsPanel">
      <div className="Greeting__Brand">
        <svg className="Greeting__Logo" viewBox={realmLogo.viewBox}>
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
        {cloudStatus && cloudStatus.raasToken ? (
          <Button
            className="Greeting__Action"
            onClick={onConnectToDefaultRealmCloud}
            color="primary"
            disabled={!cloudStatus.defaultTenant}
          >
            Connect to Realm Cloud
          </Button>
        ) : (
          <Button
            className="Greeting__Action"
            onClick={onAuthenticate}
            color="primary"
          >
            <i className="fa fa-github" /> GitHub
          </Button>
        )}
      </div>
    </div>
    <HistoryPanelContainer />
    <CloudOverlayContainer
      activated={isCloudOverlayActivated}
      onAuthenticated={onAuthenticated}
    />
    <SignupOverlayContainer />
  </div>
);
