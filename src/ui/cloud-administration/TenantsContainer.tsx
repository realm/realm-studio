import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';
import { LoadingDots } from '../reusable/loading-dots';

import { Tenants } from './Tenants';

export type CreateTenantHandler = (
  controllerUrl: string,
  options: raas.ICreateTenantOptions,
) => void;

interface ITenantsContainerState {
  serviceShards: raas.IServiceShard[];
  isCreateTenantModalOpen: boolean;
}

export class TenantsContainer extends React.Component<
  {},
  ITenantsContainerState
> {
  constructor() {
    super();
    this.state = {
      serviceShards: [],
      isCreateTenantModalOpen: false,
    };
  }

  public render() {
    return this.state.serviceShards && this.state.serviceShards.length > 0 ? (
      <Tenants
        isCreateTenantModalOpen={this.state.isCreateTenantModalOpen}
        onConnectToTenant={this.onConnectToTenant}
        onCreateTenant={this.onCreateTenant}
        onDeleteTenant={this.onDeleteTenant}
        onLogout={this.onLogout}
        onToggleCreateTenantModal={this.onToggleCreateTenantModal}
        serviceShards={this.state.serviceShards}
      />
    ) : (
      <section className="CloudAdministration__LoadingDots">
        <LoadingDots />
      </section>
    );
  }

  public async componentDidMount() {
    this.fetchShardsAndTenants();
  }

  private async fetchShardsAndTenants() {
    // Fetch the data
    const serviceShards = await raas.getServiceShards();
    for (const shard of serviceShards) {
      shard.tenants = await raas.getTenants(shard.controllerUrl);
    }
    // Update the state
    this.setState({
      serviceShards,
    });
  }

  private onConnectToTenant = (url: string) => {
    main.showConnectToServer(url);
  };

  private onDeleteTenant = async (controllerUrl: string, id: string) => {
    await raas.deleteTenant(controllerUrl, id);
    this.fetchShardsAndTenants();
  };

  private onToggleCreateTenantModal = () => {
    this.setState({
      isCreateTenantModalOpen: !this.state.isCreateTenantModalOpen,
    });
  };

  private onCreateTenant: CreateTenantHandler = async (
    controllerUrl,
    options,
  ) => {
    await raas.createTenant(controllerUrl, options);
    this.fetchShardsAndTenants();
  };

  private onLogout = () => {
    raas.forgetToken();
  };
}
