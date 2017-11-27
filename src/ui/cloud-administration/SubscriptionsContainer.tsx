import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';
import { LoadingDots } from '../reusable/loading-dots';

import { Subscriptions } from './Subscriptions';

export type CreateSubscriptionHandler = (
  options: raas.user.ICreateSubscriptionOptions,
) => void;

interface ISubscriptionsContainerProps {
  onLogout: () => void;
}

interface ISubscriptionsContainerState {
  locations: raas.ILocation[];
  isCreateSubscriptionModalOpen: boolean;
}

export class SubscriptionsContainer extends React.Component<
  ISubscriptionsContainerProps,
  ISubscriptionsContainerState
> {
  constructor() {
    super();
    this.state = {
      locations: [],
      isCreateSubscriptionModalOpen: false,
    };
  }

  public render() {
    return this.state.locations && this.state.locations.length > 0 ? (
      <Subscriptions
        isCreateSubscriptionModalOpen={this.state.isCreateSubscriptionModalOpen}
        onConnectToSubscription={this.onConnectToSubscription}
        onCreateSubscription={this.onCreateSubscription}
        onDeleteSubscription={this.onDeleteSubscription}
        onLogout={this.props.onLogout}
        onToggleCreateSubscriptionModal={this.onToggleCreateSubscriptionModal}
        locations={this.state.locations}
      />
    ) : (
      <section className="CloudAdministration__LoadingDots">
        <LoadingDots />
      </section>
    );
  }

  public async componentDidMount() {
    this.fetchLocationsAndSubscriptions();
  }

  private async fetchLocationsAndSubscriptions() {
    // Fetch the data
    /*
    // TODO: Adapt to the changes in RaaS
    const locations = await raas.getLocations();
    for (const shard of locations) {
      shard.tenants = await raas.getSubscriptions(shard.controllerUrl);
    }
    // Update the state
    this.setState({
      locations,
    });
    */
  }

  private onConnectToSubscription = (url: string) => {
    main.showConnectToServer(url);
  };

  private onDeleteSubscription = async (controllerUrl: string, id: string) => {
    // TODO: Adapt to the changes in RaaS
    // await raas.deleteSubscription(controllerUrl, id);
    this.fetchLocationsAndSubscriptions();
  };

  private onToggleCreateSubscriptionModal = () => {
    this.setState({
      isCreateSubscriptionModalOpen: !this.state.isCreateSubscriptionModalOpen,
    });
  };

  private onCreateSubscription: CreateSubscriptionHandler = async options => {
    // TODO: Adapt to the changes in RaaS
    await raas.user.createSubscription(options);
    this.fetchLocationsAndSubscriptions();
  };
}
