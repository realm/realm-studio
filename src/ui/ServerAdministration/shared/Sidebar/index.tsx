import * as classNames from 'classnames';
import * as React from 'react';

import './Sidebar.scss';

export interface IProps {
  className: string;
  isOpen: boolean;
  children: React.ReactNode;
  onToggle?: () => void;
}

export const Sidebar = ({ className, isOpen, children, onToggle }: IProps) => (
  <div
    className={classNames(className, isOpen ? `${className}--open` : undefined)}
  >
    {children}
    {onToggle ? (
      <div onClick={onToggle} className={`${className}__CloseToggle`}>
        <i className="fa fa-angle-right" />
      </div>
    ) : null}
  </div>
);
