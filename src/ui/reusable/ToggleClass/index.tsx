import * as classnames from 'classnames';
import * as React from 'react';

export interface IProps {
  isOpen: boolean;
  classUsedWhenOpened: string;
  classUsedWhenClosed: string;
  children: React.ReactNode;
}

export const ToggleClass = ({
  isOpen,
  children,
  classUsedWhenOpened,
  classUsedWhenClosed,
}: IProps) => (
  <div
    className={classnames(isOpen ? classUsedWhenOpened : classUsedWhenClosed)}
  >
    {children}
  </div>
);
