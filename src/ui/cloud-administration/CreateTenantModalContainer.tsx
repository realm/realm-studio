import * as React from 'react';

import { IServiceShard } from '../../services/raas';

import { CreateTenantModal } from './CreateTenantModal';
import { CreateTenantHandler } from './TenantsContainer';

interface ICreateTenantModalContainerProps {
  isOpen: boolean;
  onCreateTenant: CreateTenantHandler;
  onToggle: () => void;
  shards: IServiceShard[];
}

interface ICreateTenantModalContainerState {
  id: string;
  password: string;
  selectedShardId?: string;
}

export class CreateTenantModalContainer extends React.Component<
  ICreateTenantModalContainerProps,
  ICreateTenantModalContainerState
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
      <CreateTenantModal
        isOpen={this.props.isOpen}
        onCreateTenant={this.onCreateTenant}
        onIdChange={this.onIdChange}
        onPasswordChange={this.onPasswordChange}
        onShardChange={this.onShardChange}
        onToggle={this.props.onToggle}
        shards={this.props.shards}
        {...this.state}
      />
    );
  }

  private onCreateTenant = () => {
    const selectedShard = this.props.shards.find(shard => {
      return shard.id === this.state.selectedShardId;
    });

    if (selectedShard) {
      this.props.onCreateTenant(selectedShard.controllerUrl, {
        id: this.state.id,
        password: this.state.password,
      });
    } else {
      throw new Error(`Unexpected shard ${this.state.selectedShardId}`);
    }
  };

  private onIdChange = (id: string) => {
    this.setState({ id });
  };

  private onShardChange = (shardId: string) => {
    this.setState({ selectedShardId: shardId });
  };

  private onPasswordChange = (password: string) => {
    this.setState({ password });
  };
}
