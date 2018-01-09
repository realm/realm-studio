import * as electron from 'electron';
import * as qs from 'querystring';
import * as React from 'react';

import { main } from '../../actions/main';
import { ICloudStatus } from '../../main/CloudManager';
import { IUpdateStatus } from '../../main/Updater';
import * as raas from '../../services/raas';
import { IServerCredentials } from '../../services/ros';
import { store } from '../../store';
import { showError } from '../reusable/errors';

import { Greeting } from './Greeting';

export type SocialNetwork = 'twitter' | 'facebook' | 'reddit' | 'hacker-news';

interface IGreetingContainerState {
  cloudStatus?: ICloudStatus;
  isAuthenticating: boolean;
  isCloudOverlayActivated: boolean;
  isSyncEnabled: boolean;
  updateStatus: IUpdateStatus;
  version: string;
}

export class GreetingContainer extends React.Component<
  {},
  IGreetingContainerState
> {
  constructor() {
    super();
    this.state = {
      isAuthenticating: false,
      isCloudOverlayActivated: false,
      isSyncEnabled: false,
      updateStatus: {
        state: 'up-to-date',
      },
      version: electron.remote.app.getVersion() || 'unknown',
    };
  }

  public componentDidMount() {
    electron.ipcRenderer.on('cloud-status', this.cloudStatusChanged);
    electron.ipcRenderer.on('update-status', this.updateStatusChanged);
    // Require realm and check update state with the sync support
    // Using nextTick to prevent blocking when loading realm
    process.nextTick(() => {
      const Realm = require('realm');
      this.setState({
        isSyncEnabled: !!Realm.Sync,
      });
    });
    // Ask the main process to send a cloud status message
    main.refreshCloudStatus();
  }

  public componentWillUnmount() {
    electron.ipcRenderer.removeListener(
      'cloud-status',
      this.cloudStatusChanged,
    );
    electron.ipcRenderer.removeListener(
      'update-status',
      this.updateStatusChanged,
    );
  }

  public render() {
    return <Greeting {...this.state} {...this} />;
  }

  public onAuthenticate = async () => {
    // Authenticate with GitHub
    this.setState({
      isAuthenticating: true,
    });
    await main.authenticateWithGitHub();
    this.setState({
      isAuthenticating: false,
      isCloudOverlayActivated: true,
    });
  };

  public onActivateCloudOverlay = () => {
    this.setState({
      isCloudOverlayActivated: true,
    });
  };

  public onCloudSubscriptionCreated = async (
    subscription?: raas.user.ISubscription,
  ) => {
    await main.refreshCloudStatus();
    this.onConnectToPrimarySubscription(subscription);
  };

  public onConnectToPrimarySubscription = async (
    subscription?: raas.user.ISubscription,
  ): Promise<void> => {
    try {
      if (!subscription) {
        const { cloudStatus } = this.state;
        if (cloudStatus && cloudStatus.kind === 'has-primary-subscription') {
          return this.onConnectToPrimarySubscription(
            cloudStatus.primarySubscription,
          );
        } else {
          throw new Error(`Missing a primary subscription`);
        }
      } else {
        const tenantUrl = subscription.tenantUrl;
        if (tenantUrl) {
          const credentials = raas.user.getTenantCredentials(tenantUrl);
          return main.showServerAdministration({
            type: 'server-administration',
            credentials,
            validateCertificates: true,
            isCloudTenant: true,
          });
        } else {
          throw new Error(`Couldn't determine the URL of the server`);
        }
      }
    } catch (err) {
      showError('Failed to connect to the server', err);
    }
  };

  public onConnectToServer = () => {
    main.showConnectToServer();
  };

  public onOpenLocalRealm = () => {
    main.showOpenLocalRealm();
  };

  public onCheckForUpdates = () => {
    main.checkForUpdates();
  };

  public onDeauthenticate = () => {
    main.deauthenticate();
  };

  public updateStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: IUpdateStatus,
  ) => {
    this.setState({ updateStatus: status });
  };

  public cloudStatusChanged = (
    e: Electron.IpcMessageEvent,
    status: ICloudStatus,
  ) => {
    // Focus the window when the status requires the users attention
    if (
      status.kind === 'error' ||
      (status.kind === 'authenticating' && !status.waitingForUser)
    ) {
      electron.remote.getCurrentWindow().focus();
    }
    // Update the state
    if (status.kind === 'authenticated' && status.justAuthenticated) {
      this.setState({
        cloudStatus: status,
        isCloudOverlayActivated: true,
      });
    } else {
      this.setState({
        cloudStatus: status,
      });
    }
  };

  public onShare = (socialNetwork: SocialNetwork) => {
    const url = this.getShareUrl(socialNetwork);
    if (url) {
      electron.shell.openExternal(url);
    } else {
      alert('We have not announced this yet');
    }
  };

  protected getShareUrl(socialNetwork: SocialNetwork) {
    if (socialNetwork === 'twitter') {
      // See https://dev.twitter.com/web/tweet-button for options
      const query = qs.stringify({
        text: 'Excited that Realm is creating a #cloud solution!',
        via: 'realm',
      });
      return `https://twitter.com/intent/tweet?${query}`;
    } else if (socialNetwork === 'facebook') {
      const query = qs.stringify({
        // TODO: Update this URL once we have announced it
        u: encodeURI('https://realm.io/products/realm-cloud'),
        display: 'page',
      });
      return `https://www.facebook.com/sharer/sharer.php?${query}`;
    } else if (socialNetwork === 'reddit') {
      // TODO: Make this a link to a post we've created
    } else if (socialNetwork === 'hacker-news') {
      // TODO: Make this a link to a post we've created
      // https://news.ycombinator.com/item?id=15853477
    }
  }
}
