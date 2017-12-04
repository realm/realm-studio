import * as classnames from 'classnames';
import * as React from 'react';
import './Sidebar.scss';

export interface IProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const Sidebar = ({ isOpen, children }: IProps) => (
  <div className={classnames(isOpen ? 'Sidebar--active Sidebar' : 'Sidebar')}>
    {children}
  </div>
);
