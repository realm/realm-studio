import * as React from 'react';
import { Alert, Button } from 'reactstrap';

import { ICloudStatus } from '../../main/CloudManager';
import { LoadingDots } from '../reusable/loading-dots';
import { SocialNetwork } from './GreetingContainer';

export interface ICloudActionButtonProps {
  cloudStatus?: ICloudStatus;
  onActivateCloudOverlay: () => void;
  onAuthenticate: () => void;
  onConnectToPrimarySubscription: () => void;
  onDeauthenticate: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
}

export const CloudAction = ({
  cloudStatus,
  onActivateCloudOverlay,
  onAuthenticate,
  onConnectToPrimarySubscription,
  onDeauthenticate,
  onShare,
}: ICloudActionButtonProps) => {
  if (cloudStatus && cloudStatus.kind === 'authenticating') {
    return (
      <Alert className="Greeting__CloudStatus" color="info">
        {cloudStatus.waitingForUser
          ? 'Waiting for you to grant access'
          : 'Waiting for Realm Cloud to authenticate'}
        <LoadingDots className="Greeting__CloudStatus__LoadingDots" />
      </Alert>
    );
  } else if (cloudStatus && cloudStatus.kind === 'fetching') {
    return (
      <Alert className="Greeting__CloudStatus" color="info">
        Fetching your profile and subscriptions
        <LoadingDots className="Greeting__CloudStatus__LoadingDots" />
      </Alert>
    );
  } else if (cloudStatus && cloudStatus.kind === 'authenticated') {
    return cloudStatus.user.canCreate ? (
      <Button
        className="Greeting__Action"
        onClick={onActivateCloudOverlay}
        color="primary"
      >
        Create Realm Cloud server
      </Button>
    ) : (
      <Alert color="info">
        <small>
          You're on the waitlist to use Realm Cloud!{' '}
          <span
            className="Greeting__ShareAction"
            onClick={() => onShare('twitter')}
            title="Now that's something worth tweeting about!"
          >
            <i className="fa fa-twitter" />
          </span>{' '}
          <span
            className="Greeting__ShareAction"
            onClick={() => onShare('facebook')}
            title="Now that's something worth sharing!"
          >
            <i className="fa fa-facebook" />
          </span>{' '}
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
        </small>
      </Alert>
    );
  } else if (cloudStatus && cloudStatus.kind === 'has-primary-subscription') {
    return (
      <Button
        className="Greeting__Action"
        onClick={() => onConnectToPrimarySubscription()}
        color="primary"
      >
        Connect to Realm Cloud
      </Button>
    );
  } else if (cloudStatus && cloudStatus.kind === 'error') {
    return (
      <Alert className="Greeting__CloudStatus" color="danger">
        <span title={cloudStatus.message}>
          Failed while contacting Realm Cloud
        </span>
        <i
          className="Greeting__CloudStatus__Close fa fa-close"
          onClick={onDeauthenticate}
        />
      </Alert>
    );
  } else {
    return (
      <Button
        className="Greeting__Action"
        color="primary"
        disabled={!cloudStatus || cloudStatus.kind !== 'not-authenticated'}
        onClick={onAuthenticate}
      >
        <i className="fa fa-github" /> GitHub
      </Button>
    );
  }
};
