import * as classnames from 'classnames';
import * as React from 'react';
import './FloatingControls.scss';

export interface IProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const FloatingControls = ({ isOpen, children }: IProps) => (
  <div
    className={classnames(
      isOpen ? 'FloatingControls' : 'FloatingControls FloatingControls--hidden',
    )}
  >
    {children}
  </div>
);
