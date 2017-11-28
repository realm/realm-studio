import * as React from 'react';
import { ToggleClass } from '../../../reusable/ToggleClass';
import './Sidebar.scss';

export interface IProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Sidebar = ({ isOpen, children }: IProps) => (
  <ToggleClass
    isOpen={isOpen}
    classUsedWhenOpened="Sidebar--active Sidebar"
    classUsedWhenClosed="Sidebar"
  >
    {children}
  </ToggleClass>
);
