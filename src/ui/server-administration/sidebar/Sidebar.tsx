import * as classnames from 'classnames';
import * as React from 'react';
import './Sidebar.scss';

export interface IProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Sidebar = ({ isOpen, children }: IProps) => (
  <div className={classnames(isOpen && 'Sidebar--active', 'Sidebar')}>
    {children}
  </div>
);

export default Sidebar;
