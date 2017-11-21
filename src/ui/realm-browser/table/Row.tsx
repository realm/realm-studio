import * as classnames from 'classnames';
import * as React from 'react';

import { IGridRowProps } from './rowCellRangeRenderer';

export interface IRowProps extends IGridRowProps {
  isHighlighted: boolean;
  isSorting: boolean;
}

export const Row = ({
  children,
  isHighlighted,
  isSorting,
  rowIndex,
  style,
}: IRowProps) => {
  return (
    <div
      className={classnames('RealmBrowser__Table__Row', {
        'RealmBrowser__Table__Row--highlighted': isHighlighted,
        'RealmBrowser__Table__Row--striped': rowIndex % 2 === 1 && !isSorting,
        'RealmBrowser__Table__Row--sorting': isSorting,
      })}
      style={style}
    >
      {children}
    </div>
  );
};
