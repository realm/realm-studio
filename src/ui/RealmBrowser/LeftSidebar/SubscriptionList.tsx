import React from 'react';

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
        {subscriptions.map(sub => (
          <li
            className="LeftSidebar__SubscriptionItem"
            key={sub.id.toHexString()}
          >
            <span className="LeftSidebar__SubscriptionItemQuery">
              {sub.queryString}
            </span>
            <span className="LeftSidebar__SubscriptionItemControls">
              <i
                className="fa fa-trash"
                onClick={() => {
                  onSubscriptionRemoved(sub);
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
