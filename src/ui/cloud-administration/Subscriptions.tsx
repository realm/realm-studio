import * as React from 'react';
import { Badge, Button, Table } from 'reactstrap';

import { ILocation, user } from '../../services/raas';

import { CreateSubscriptionModalContainer } from './CreateSubscriptionModalContainer';
import { CreateSubscriptionHandler } from './SubscriptionsContainer';

export const Subscriptions = ({
  isCreateSubscriptionModalOpen,
  onConnectToSubscription,
  onCreateSubscription,
  onDeleteSubscription,
  onLogout,
  onToggleCreateSubscriptionModal,
  locations,
}: {
  isCreateSubscriptionModalOpen: boolean;
  onConnectToSubscription: (url: string) => void;
  onCreateSubscription: CreateSubscriptionHandler;
  onDeleteSubscription: (controllerUrl: string, id: string) => void;
  onLogout: () => void;
  onToggleCreateSubscriptionModal: () => void;
  locations: ILocation[];
}) => (
  <div className="CloudAdministration__Subscriptions">
    <div className="CloudAdministration__Subscriptions__TableWrapper">
      <Table
        className="CloudAdministration__Subscriptions__Table"
        size="sm"
        inverse={true}
      >
        <thead>
          <tr>
            <th>Subscription</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Status</th>
            <th>{/* Controls */}</th>
          </tr>
        </thead>
        <tbody>
          {/*subscriptions.map(tenant => (
            <tr className="CloudAdministration__Subscriptions__Subscription">
              <td>
                <a target="_blank" href={tenant.url}>
                  {tenant.url}
                </a>
              </td>
              <td>{tenant.owner}</td>
              <td>{shard.label}</td>
              <td>
                <Badge
                  className="CloudAdministration__Subscriptions__InstanceStatus"
                  color={tenant.status === 'Running' ? 'success' : 'default'}
                >
                  {tenant.status}
                </Badge>
              </td>
              <td className="CloudAdministration__Subscriptions__Controls">
                <Button
                  size="sm"
                  color="primary"
                  onClick={() => {
                    onDeleteSubscription(shard.controllerUrl, tenant.id);
                  }}
                >
                  <i className="fa fa-trash" aria-hidden="true" />
                </Button>{' '}
                <Button
                  onClick={() => {
                    onConnectToSubscription(tenant.url);
                  }}
                  size="sm"
                >
                  Connect
                </Button>
              </td>
            </tr>
          ))*/}
        </tbody>
      </Table>
    </div>
    <div className="CloudAdministration__Subscriptions__Footer">
      <Button
        onClick={() => {
          onToggleCreateSubscriptionModal();
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

    <CreateSubscriptionModalContainer
      isOpen={isCreateSubscriptionModalOpen}
      onCreateSubscription={onCreateSubscription}
      onToggle={onToggleCreateSubscriptionModal}
      locations={locations}
    />
  </div>
);
