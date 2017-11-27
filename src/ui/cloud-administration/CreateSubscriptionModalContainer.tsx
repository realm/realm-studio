import * as React from 'react';

import { ILocation } from '../../services/raas';

import { CreateSubscriptionModal } from './CreateSubscriptionModal';
import { CreateSubscriptionHandler } from './SubscriptionsContainer';

interface ICreateSubscriptionModalContainerProps {
  isOpen: boolean;
  onCreateSubscription: CreateSubscriptionHandler;
  onToggle: () => void;
  locations: ILocation[];
}

interface ICreateSubscriptionModalContainerState {
  id: string;
  password: string;
  selectedLocationId?: string;
}

export class CreateSubscriptionModalContainer extends React.Component<
  ICreateSubscriptionModalContainerProps,
  ICreateSubscriptionModalContainerState
> {
  constructor() {
    super();
    this.state = {
      id: '',
      password: '',
    };
  }

  public render() {
    return (
      <CreateSubscriptionModal
        isOpen={this.props.isOpen}
        onCreateSubscription={this.onCreateSubscription}
        onIdChange={this.onIdChange}
        onPasswordChange={this.onPasswordChange}
        onLocationChange={this.onLocationChange}
        onToggle={this.onToggle}
        locations={this.props.locations}
        {...this.state}
      />
    );
  }

  private onCreateSubscription = () => {
    if (this.state.selectedLocationId) {
      this.props.onCreateSubscription({
        identifier: this.state.id,
        locationId: this.state.selectedLocationId,
        initialPassword: this.state.password,
      });
    } else {
      throw new Error(`Unexpected shard ${this.state.selectedLocationId}`);
    }
  };

  private onIdChange = (id: string) => {
    this.setState({ id });
  };

  private onLocationChange = (shardId: string) => {
    this.setState({ selectedLocationId: shardId });
  };

  private onPasswordChange = (password: string) => {
    this.setState({ password });
  };

  private onToggle = () => {
    this.setState({
      id: '',
      password: '',
    });
    this.props.onToggle();
  };
}
