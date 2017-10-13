import * as classnames from 'classnames';
import * as React from 'react';

export const MoreIndicator = ({
  position,
  visible,
}: {
  position: 'top' | 'bottom' | 'left' | 'right';
  visible: boolean;
}) => (
  <div
    className={classnames(
      'RealmBrowser__Content__More',
      `RealmBrowser__Content__More--${position}`,
      {
        'RealmBrowser__Content__More--visible': visible,
      },
    )}
  />
);
