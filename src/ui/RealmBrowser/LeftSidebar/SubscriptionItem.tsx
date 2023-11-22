import React, { useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import Realm from 'realm';

export type SubscriptionItemProps = {
  subscription: Realm.App.Sync.Subscription;
  onSubscriptionRemoved: (subscription: Realm.App.Sync.Subscription) => void;
};

export function SubscriptionItem({
  subscription,
  onSubscriptionRemoved,
}: SubscriptionItemProps) {
  const [isHintOpen, setHintOpen] = useState(false);
  const hintId = `subscription-hint-${subscription.id.toHexString()}`;
  return (
    <li
      className="LeftSidebar__SubscriptionItem"
      key={subscription.id.toHexString()}
    >
      <span className="LeftSidebar__SubscriptionItemQuery">
        {subscription.queryString}
      </span>
      <span className="LeftSidebar__SubscriptionItemControls">
        {subscription.queryString === 'TRUEPREDICATE' && (
          <>
            <i
              id={hintId}
              className="fa fa-question"
              onMouseEnter={() => setHintOpen(true)}
              onMouseLeave={() => setHintOpen(false)}
            />
            <Popover isOpen={isHintOpen} target={hintId}>
              <PopoverBody>This query will match all objects</PopoverBody>
            </Popover>
          </>
        )}
        <i
          className="fa fa-trash"
          onClick={() => {
            onSubscriptionRemoved(subscription);
          }}
        />
      </span>
    </li>
  );
}
