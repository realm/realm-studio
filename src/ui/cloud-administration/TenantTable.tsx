import * as React from 'react';
import { Badge, Button, Table } from 'reactstrap';

import { IServiceShard, ITenant } from './TenantTableContainer';

export const TenantTable = ({
  serviceShards,
  onConnectToTenant,
}: {
  serviceShards: IServiceShard[];
  onConnectToTenant: (url: string) => void;
}) => (
  <Table
    className="CloudAdministration__InstanceAdministration"
    size="sm"
    inverse={true}
  >
    <thead>
      <tr>
        <th>Tenant</th>
        <th>Owner</th>
        <th>Status</th>
        <th>Location</th>
        <th>{/* Controls */}</th>
      </tr>
    </thead>
    <tbody>
      {serviceShards.map(shard => {
        return shard.tenants.map(tenant => (
          <tr className="CloudAdministration__Instance">
            <td>
              <a target="_blank" href={tenant.url}>
                {tenant.url}
              </a>
            </td>
            <td>{tenant.owner}</td>
            <td>
              <Badge
                className="CloudAdministration__InstanceStatus"
                color={tenant.status === 'Running' ? 'success' : 'default'}
              >
                {tenant.status}
              </Badge>
            </td>
            <td>{shard.label}</td>
            <td>
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
);
