import * as React from 'react';

import { main } from '../../actions/main';
import * as raas from '../../services/raas';
import { LoadingDots } from '../reusable/loading-dots';

import { TenantTable } from './TenantTable';

// {"id":"test1","owner":"github/alebsack","status":"Running","url":"https://test1.ie1.raas.realmlab.net"}
export interface ITenant {
  id: string;
  owner: string;
  status: string;
  url: string;
}

// {"id":"ie1","controllerUrl":"https://ie1.raas.realmlab.net","region":"ireland","label":"Ireland Dev 1"}
export interface IServiceShard {
  id: string;
  controllerUrl: string;
  region: string;
  label: string;
  tenants: ITenant[];
}

interface ITenantTableContainerState {
  serviceShards: IServiceShard[];
}

export class TenantTableContainer extends React.Component<
  {},
  ITenantTableContainerState
> {
  constructor() {
    super();
    this.state = {
      serviceShards: [],
    };
  }

  public render() {
    return this.state.serviceShards && this.state.serviceShards.length > 0 ? (
      <TenantTable
        onConnectToTenant={this.onConnectToTenant}
        serviceShards={this.state.serviceShards}
      />
    ) : (
      <section className="CloudAdministration__LoadingDots">
        <LoadingDots />
      </section>
    );
  }

  public async componentDidMount() {
    const serviceShards: IServiceShard[] = await raas.getServiceShards();
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
}
