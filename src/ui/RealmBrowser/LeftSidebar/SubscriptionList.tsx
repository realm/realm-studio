import React from 'react';

import { SubscriptionItem } from './SubscriptionItem';

export type SubscriptionListProps = {
  subscriptions: Realm.App.Sync.Subscription[];
  onSubscriptionRemoved: (subscription: Realm.App.Sync.Subscription) => void;
};

export function SubscriptionList({
  subscriptions,
  onSubscriptionRemoved,
}: SubscriptionListProps) {
  return (
    <>
      <ul className="LeftSidebar__Subscriptions">
        {subscriptions.length === 0 && <em>Click + to add subscriptions</em>}
        {subscriptions.map(subscription => (
          <SubscriptionItem
            key={subscription.id.toHexString()}
            subscription={subscription}
            onSubscriptionRemoved={onSubscriptionRemoved}
          />
        ))}
      </ul>
    </>
  );
}
