import * as React from 'react';
import { Badge, Button, Table } from 'reactstrap';

import {
  ICreateTenantOptions,
  IServiceShard,
  ITenant,
} from '../../services/raas';

import { CreateTenantModalContainer } from './CreateTenantModalContainer';
import { CreateTenantHandler } from './TenantsContainer';

export const Tenants = ({
  isCreateTenantModalOpen,
  onConnectToTenant,
  onCreateTenant,
  onDeleteTenant,
  onLogout,
  onToggleCreateTenantModal,
  serviceShards,
}: {
  isCreateTenantModalOpen: boolean;
  onConnectToTenant: (url: string) => void;
  onCreateTenant: CreateTenantHandler;
  onDeleteTenant: (controllerUrl: string, id: string) => void;
  onLogout: () => void;
  onToggleCreateTenantModal: () => void;
  serviceShards: IServiceShard[];
}) => (
  <div className="CloudAdministration__Tenants">
    <div className="CloudAdministration__Tenants__TableWrapper">
      <Table
        className="CloudAdministration__Tenants__Table"
        size="sm"
        inverse={true}
      >
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Status</th>
            <th>{/* Controls */}</th>
          </tr>
        </thead>
        <tbody>
          {serviceShards.map(shard => {
            return shard.tenants.map(tenant => (
              <tr className="CloudAdministration__Tenants__Tenant">
                <td>
                  <a target="_blank" href={tenant.url}>
                    {tenant.url}
                  </a>
                </td>
                <td>{tenant.owner}</td>
                <td>{shard.label}</td>
                <td>
                  <Badge
                    className="CloudAdministration__Tenants__InstanceStatus"
                    color={tenant.status === 'Running' ? 'success' : 'default'}
                  >
                    {tenant.status}
                  </Badge>
                </td>
                <td className="CloudAdministration__Tenants__Controls">
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => {
                      onDeleteTenant(shard.controllerUrl, tenant.id);
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true" />
                  </Button>{' '}
                  <Button
                    onClick={() => {
                      onConnectToTenant(tenant.url);
                    }}
                    size="sm"
                  >
                    Connect
                  </Button>
                </td>
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </div>
    <div className="CloudAdministration__Tenants__Footer">
      <Button
        onClick={() => {
          onToggleCreateTenantModal();
        }}
      >
        Start a new Realm Object Server
      </Button>
      &nbsp;
      <Button
        color="primary"
        onClick={() => {
          onLogout();
        }}
      >
        Logout
      </Button>
    </div>

    <CreateTenantModalContainer
      isOpen={isCreateTenantModalOpen}
      onCreateTenant={onCreateTenant}
      onToggle={onToggleCreateTenantModal}
      shards={serviceShards}
    />
  </div>
);
