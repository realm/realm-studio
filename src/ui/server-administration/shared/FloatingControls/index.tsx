import * as React from 'react';
import { ToggleClass } from '../../../reusable/ToggleClass';
import './FloatingControls.scss';

export interface IProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const FloatingControls = ({ isOpen, children }: IProps) => (
  <ToggleClass
    isOpen={isOpen}
    classUsedWhenOpened="FloatingControls"
    classUsedWhenClosed="FloatingControls FloatingControls--hidden"
  >
    {children}
  </ToggleClass>
);
