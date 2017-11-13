import * as os from 'os';
import * as React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import * as util from 'util';

import { IUpdateStatus } from '../../main/Updater';
import { IServerCredentials } from '../../services/ros';

import realmLogo from '../../../static/svgs/realm-logo.svg';
import { CloudOverlayContainer } from './CloudOverlayContainer';
import { HistoryPanelContainer } from './HistoryPanelContainer';
import { SignupOverlayContainer } from './SignupOverlayContainer';
import { UpdateStatusIndicator } from './UpdateStatusIndicator';

import './Greeting.scss';

export const Greeting = ({
  defaultCloudCrendentials,
  hasAuthenticated,
  isCloudOverlayVisible,
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
  defaultCloudCrendentials?: IServerCredentials;
  hasAuthenticated: boolean;
  isCloudOverlayVisible: boolean;
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
        {hasAuthenticated && defaultCloudCrendentials ? (
          <Button
            className="Greeting__Action"
            onClick={onConnectToDefaultRealmCloud}
            color="primary"
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
        <Button
          className="Greeting__Action"
          size="sm"
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
        <Button
          className="Greeting__Action"
          size="sm"
          onClick={onOpenLocalRealm}
        >
          Open a local Realm
        </Button>
      </div>
    </div>
    <HistoryPanelContainer />
    <CloudOverlayContainer
      onAuthenticated={onAuthenticated}
      visible={isCloudOverlayVisible}
    />
    <SignupOverlayContainer />
  </div>
);
