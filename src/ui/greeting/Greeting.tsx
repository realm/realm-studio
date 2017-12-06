import * as os from 'os';
import * as React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import * as util from 'util';

import { ICloudStatus } from '../../main/CloudManager';
import { IUpdateStatus } from '../../main/Updater';
import { IServerCredentials } from '../../services/ros';

import realmLogo from '../../../static/svgs/realm-logo.svg';
import { CloudAction } from './CloudAction';
import { CloudOverlay } from './CloudOverlay';
import { SocialNetwork } from './GreetingContainer';
import { HistoryPanelContainer } from './HistoryPanelContainer';
import { SignupOverlayContainer } from './SignupOverlayContainer';
import { UpdateStatusIndicator } from './UpdateStatusIndicator';

import './Greeting.scss';

export const Greeting = ({
  cloudStatus,
  isAuthenticating,
  isCloudOverlayActivated,
  isSyncEnabled,
  onActivateCloudOverlay,
  onAuthenticate,
  onCheckForUpdates,
  onCloudSubscriptionCreated,
  onConnectToPrimarySubscription,
  onConnectToServer,
  onOpenLocalRealm,
  onShare,
  updateStatus,
  version,
}: {
  cloudStatus?: ICloudStatus;
  isAuthenticating: boolean;
  isCloudOverlayActivated: boolean;
  isSyncEnabled: boolean;
  onActivateCloudOverlay: () => void;
  onAuthenticate: () => void;
  onCheckForUpdates: () => void;
  onCloudSubscriptionCreated: () => void;
  onConnectToPrimarySubscription: () => void;
  onConnectToServer: () => void;
  onOpenLocalRealm: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
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
        <CloudAction
          cloudStatus={cloudStatus}
          onActivateCloudOverlay={onActivateCloudOverlay}
          onAuthenticate={onAuthenticate}
          onConnectToPrimarySubscription={onConnectToPrimarySubscription}
          onShare={onShare}
        />
      </div>
      <div className="Greeting__DownloadDemo">
        <span>New to realm? </span>
        <a
          href="https://static.realm.io/downloads/realm-studio/demo.realm"
          className="Link"
        >
          Download a demo Realm file
        </a>
      </div>
    </div>
    <HistoryPanelContainer />
    {cloudStatus &&
    cloudStatus.kind === 'authenticated' &&
    (cloudStatus.justAuthenticated || cloudStatus.user.canCreate) ? (
      <CloudOverlay
        onCloudSubscriptionCreated={onCloudSubscriptionCreated}
        onShare={onShare}
        user={cloudStatus.user}
      />
    ) : null}
    <SignupOverlayContainer />
  </div>
);
