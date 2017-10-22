import * as classnames from 'classnames';
import * as React from 'react';

import { MoreIndicator } from './MoreIndicator';

export const MoreIndicators = ({
  scrollBottom,
  scrollLeft,
  scrollRight,
  scrollTop,
}: {
  scrollBottom: number;
  scrollLeft: number;
  scrollRight: number;
  scrollTop: number;
}) => {
  return (
    <div>
      <MoreIndicator position="bottom" visible={scrollBottom > 0} />
      <MoreIndicator position="left" visible={scrollLeft > 0} />
      <MoreIndicator position="right" visible={scrollRight > 0} />
      <MoreIndicator position="top" visible={scrollTop > 0} />
    </div>
  );
};
