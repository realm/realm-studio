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
  onServerCreate: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
}

export const CloudAction = ({
  cloudStatus,
  onAuthenticate,
  onConnectToPrimarySubscription,
  onDeauthenticate,
  onRefresh,
  onServerCreate,
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
        Fetching your profile and subscriptions
        <LoadingDots className="CloudAction__LoadingDots" />
      </Alert>
    );
  } else if (cloudStatus && cloudStatus.kind === 'authenticated') {
    return cloudStatus.user.canCreate ? (
      <Button onClick={onServerCreate} color="primary">
        Create Realm Cloud server
      </Button>
    ) : (
      <Alert className="CloudAction__Alert" color="info">
        You're on the waitlist to use Realm Cloud!{' '}
        <span
          className="CloudAction__ActionIcon"
          onClick={() => onShare('twitter')}
          title="Now that's something worth tweeting about!"
        >
          <i className="fa fa-twitter" />
        </span>{' '}
        <span
          className="CloudAction__ActionIcon"
          onClick={() => onShare('facebook')}
          title="Now that's something worth sharing!"
        >
          <i className="fa fa-facebook" />
        </span>{' '}
        <span
          className="CloudAction__ActionIcon"
          onClick={() => onRefresh()}
          title="Refresh this status"
        >
          <i className="fa fa-refresh" />
        </span>
        {/*
        <span
          className="Greeting__ShareAction"
          onClick={() => onShare('reddit')}
          title="Now that's something worth upvoting!"
        >
          <i className="fa fa-reddit" />
        </span>{' '}
        <span
          className="Greeting__ShareAction"
          onClick={() => onShare('hacker-news')}
          title="Now that's something worth upvoting!"
        >
          <i className="fa fa-hacker-news" />
        </span>
        */}
      </Alert>
    );
  } else if (cloudStatus && cloudStatus.kind === 'has-primary-subscription') {
    return (
      <Button onClick={() => onConnectToPrimarySubscription()} color="primary">
        Connect to Realm Cloud
      </Button>
    );
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
