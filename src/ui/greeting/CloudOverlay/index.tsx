import * as faker from 'faker';
import * as moment from 'moment';
import * as React from 'react';

import { main } from '../../../actions/main';
import * as mixpanel from '../../../services/mixpanel';
import * as raas from '../../../services/raas';
import * as ros from '../../../services/ros';
import { ILoadingProgress } from '../../reusable/loading-overlay';
import { SocialNetwork } from '../GreetingContainer';

import { CloudOverlay } from './CloudOverlay';

interface ICloudOverlayContainerProps {
  onCloudSubscriptionCreated: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
  user: raas.user.IMeResponse;
}

interface ICloudOverlayContainerState {
  message: string;
  progress?: ILoadingProgress;
  showWaitingList: boolean;
  isHidden: boolean;
}

export class CloudOverlayContainer extends React.Component<
  ICloudOverlayContainerProps,
  ICloudOverlayContainerState
> {
  constructor() {
    super();
    this.state = {
      showWaitingList: false,
      message: '',
      isHidden: false,
    };
  }

  public render() {
    return (
      <CloudOverlay
        isHidden={this.state.isHidden}
        message={this.state.message}
        onHide={this.onHide}
        onMessageChange={this.onMessageChange}
        onSendMessage={this.onSendMessage}
        onShare={this.props.onShare}
        progress={this.state.progress}
        showWaitingList={this.state.showWaitingList}
        user={this.props.user}
      />
    );
  }

  public componentDidMount() {
    if (this.props.user.canCreate) {
      this.createSubscription();
    } else {
      this.setState({
        showWaitingList: true,
      });
    }
  }

  protected async createSubscription() {
    try {
      this.setState({
        progress: {
          activity: 'Fetching available locations',
          done: false,
        },
      });

      const locations = await raas.user.getLocations();
      const selectedLocation = locations[0];
      if (!selectedLocation) {
        throw new Error(`Unable to select the default location`);
      }

      // Now that we're authenticated - let's create a tenant
      const user = await raas.user.getAuth();
      const identifier = user.id.replace(/^github\//, '');
      const initialPassword = faker.internet.password();

      this.setState({
        progress: {
          activity: `Preparing a slice of Realm Cloud\n${identifier} sounds like a great name!`,
          done: false,
        },
      });

      const subscription = await raas.user.createSubscription({
        identifier,
        locationId: selectedLocation.id,
        initialPassword, // Giving a random initial password to secure the tenant
      });

      if (!subscription) {
        throw new Error(`Unable to create the tenant`);
      }

      // Poll the tenant for it's availability
      // We expect this to take 17 secound - but we're making to 27 secs to be safe
      // TODO: Make it 17 when the ROS health API has improved
      // @see https://github.com/realm/realm-object-server-private/issues/695
      // TODO: Consider polling the RaaS API instead of the tenant
      const ETA = 27;
      await this.performCountdown(ETA, async secondsRemaining => {
        this.setState({
          progress: {
            activity: `Preparing a slice of Realm Cloud\n${identifier} is ready in ~${secondsRemaining} seconds`,
            done: false,
            transferable: ETA,
            transferred: ETA - secondsRemaining,
          },
        });
        return ros.isAvailable(subscription.tenantUrl);
      });

      this.setState({
        progress: {
          activity: 'Connecting to your Realm Object Server',
          done: false,
        },
      });

      // Wait a sec (or ten).
      // TODO: remove this once /health does a better check
      // @see https://github.com/realm/realm-object-server-private/issues/695
      setTimeout(async () => {
        // Connect to the tenant
        await main.showServerAdministration({
          credentials: raas.user.getTenantCredentials(subscription.tenantUrl),
          validateCertificates: true,
          isCloudTenant: true,
        });

        this.setState({
          progress: { done: true },
        });

        this.props.onCloudSubscriptionCreated();
      }, 10000);
    } catch (err) {
      this.setState({
        progress: {
          done: true,
          failure: err.message,
        },
      });
    }
  }

  protected async performCountdown(
    estimatedDuration: number,
    callback: (remaining: number) => Promise<boolean>,
    started?: Date,
  ) {
    const now = new Date();
    if (!started) {
      started = now;
    }
    const duration = moment(now).diff(started, 'seconds');
    // Calculate the remaining seconds, ensuring it'll never be negative
    const remaining = Math.max(estimatedDuration - duration, 0);
    // Are we done yet?
    const done = await callback(remaining);
    if (!done) {
      // Return a promise that resolves when we're finally done
      return new Promise(resolve => {
        // Wait a sec ...
        setTimeout(() => {
          const result = this.performCountdown(
            estimatedDuration,
            callback,
            started,
          );
          resolve(result);
        }, 1000);
      });
    } else {
      return Promise.resolve();
    }
  }

  protected onMessageChange = (message: string) => {
    this.setState({ message });
  };

  protected onSendMessage = () => {
    mixpanel.track(
      'Realm Cloud message',
      {
        message: this.state.message,
      },
      () => {
        this.setState({ isHidden: true });
      },
    );
  };

  protected onHide = () => {
    this.setState({ isHidden: true });
  };
}

export { CloudOverlayContainer as CloudOverlay };
