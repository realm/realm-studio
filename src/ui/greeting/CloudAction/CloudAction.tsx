import * as classNames from 'classnames';
import * as React from 'react';
import {
  Alert,
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

import cloudLogo from '../../../../static/svgs/cloud-logo-simple.svg';
import { ICloudStatus, IInstance } from '../../../main/CloudManager';
import { LoadingDots } from '../../reusable/loading-dots';
import { SocialNetwork } from '../GreetingContainer';

import './CloudAction.scss';

export interface ICloudActionButtonProps {
  cloudStatus?: ICloudStatus;
  isCloudInstancesDropdownOpen: boolean;
  onAuthenticate: () => void;
  onConnectToCloudInstance: (instance: IInstance) => void;
  onDeauthenticate: () => void;
  onInstanceCreate: () => void;
  onRefresh: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
  onToggleCloudInstancesDropdown: () => void;
}

export const CloudAction = ({
  cloudStatus,
  isCloudInstancesDropdownOpen,
  onAuthenticate,
  onConnectToCloudInstance,
  onDeauthenticate,
  onInstanceCreate,
  onRefresh,
  onShare,
  onToggleCloudInstancesDropdown,
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
    if (cloudStatus.instances.length > 1) {
      return (
        <ButtonDropdown
          isOpen={isCloudInstancesDropdownOpen}
          toggle={onToggleCloudInstancesDropdown}
        >
          <DropdownToggle color="primary" caret>
            Connect to Realm Cloud
          </DropdownToggle>
          <DropdownMenu>
            {cloudStatus.instances.map(instance => (
              <DropdownItem
                key={instance.id}
                onClick={() => onConnectToCloudInstance(instance)}
              >
                {instance.projectName || instance.tenantUrl}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      );
    } else if (cloudStatus.instances.length === 1) {
      return (
        <Button
          color="primary"
          onClick={() => onConnectToCloudInstance(cloudStatus.instances[0])}
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
