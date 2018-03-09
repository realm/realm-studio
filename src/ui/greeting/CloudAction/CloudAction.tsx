import * as classNames from 'classnames';
import * as React from 'react';
import { Alert, Button } from 'reactstrap';

import cloudLogo from '../../../../static/svgs/cloud-logo-simple.svg';
import { ICloudStatus } from '../../../main/CloudManager';
import { LoadingDots } from '../../reusable/loading-dots';
import { SocialNetwork } from '../GreetingContainer';

import './CloudAction.scss';

export interface ICloudActionButtonProps {
  cloudStatus?: ICloudStatus;
  onAuthenticate: () => void;
  onConnectToPrimarySubscription: () => void;
  onDeauthenticate: () => void;
  onRefresh: () => void;
  onInstanceCreate: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
}

export const CloudAction = ({
  cloudStatus,
  onAuthenticate,
  onConnectToPrimarySubscription,
  onDeauthenticate,
  onRefresh,
  onInstanceCreate,
  onShare,
}: ICloudActionButtonProps) => {
  if (cloudStatus && cloudStatus.kind === 'authenticating') {
    return (
      <Alert className="CloudAction__Alert" color="info">
        {cloudStatus.waitingForUser
          ? 'Waiting for you to grant access'
          : 'Waiting for Realm Cloud to authenticate'}
        <LoadingDots className="CloudAction__LoadingDots" />
      </Alert>
    );
  } else if (cloudStatus && cloudStatus.kind === 'fetching') {
    return (
      <Alert className="CloudAction__Alert" color="info">
        Fetching your profile and instances
        <LoadingDots className="CloudAction__LoadingDots" />
      </Alert>
    );
  } else if (cloudStatus && cloudStatus.kind === 'authenticated') {
    if (cloudStatus.primarySubscription) {
      return (
        <Button
          onClick={() => onConnectToPrimarySubscription()}
          color="primary"
        >
          Connect to Realm Cloud
        </Button>
      );
    } else if (cloudStatus.account.emailVerified) {
      return (
        <Button onClick={onInstanceCreate} color="primary">
          Create Realm Cloud Instance
        </Button>
      );
    } else {
      return (
        <Alert className="CloudAction__Alert" color="info">
          You need to verify your email
          <i
            className="CloudAction__Refresh fa fa-refresh"
            title="Click to refresh"
            onClick={onRefresh}
          />
        </Alert>
      );
    }
  } else if (cloudStatus && cloudStatus.kind === 'error') {
    return (
      <Alert className="CloudAction__Alert" color="danger">
        <span title={cloudStatus.message}>
          Failed while contacting Realm Cloud
        </span>
        <i
          className="CloudAction__Close fa fa-close"
          onClick={onDeauthenticate}
        />
      </Alert>
    );
  } else {
    return (
      <Button
        color="primary"
        disabled={!cloudStatus || cloudStatus.kind !== 'not-authenticated'}
        onClick={onAuthenticate}
      >
        <svg className="CloudAction__Icon" viewBox={cloudLogo.viewBox}>
          <use xlinkHref={`#${cloudLogo.id}`} />
        </svg>{' '}
        Log into Realm Cloud
      </Button>
    );
  }
};
