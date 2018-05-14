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
      'RealmBrowser__Table__More',
      `RealmBrowser__Table__More--${position}`,
      {
        'RealmBrowser__Table__More--visible': visible,
      },
    )}
  />
);
