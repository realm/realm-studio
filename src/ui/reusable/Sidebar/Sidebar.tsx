////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import classNames from 'classnames';
import React from 'react';

import './Sidebar.scss';

function getToggleDirection(position: 'left' | 'right', isOpen: boolean) {
  if (isOpen) {
    return position;
  } else {
    if (position === 'left') {
      return 'right';
    } else {
      return 'left';
    }
  }
}

interface ISidebarProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  isOpen: boolean;
  isToggleable: boolean;
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent<HTMLElement>) => void;
  onToggle: () => void;
  position: 'left' | 'right';
  width: number;
  outerRef: (element: HTMLElement | null) => void;
}

export const Sidebar = ({
  children,
  className,
  contentClassName,
  isOpen,
  isResizing,
  isToggleable,
  onResizeStart,
  onToggle,
  outerRef,
  position,
  width,
}: ISidebarProps) => {
  const toggleDirection = getToggleDirection(position, isOpen);
  return (
    <div
      style={{ flexBasis: isOpen ? `${width}px` : undefined }}
      ref={outerRef}
      className={classNames(
        'Sidebar',
        `Sidebar--${position}`,
        `Sidebar--${isOpen ? 'opened' : 'closed'}`,
        {
          'Sidebar--resizing': isResizing,
          'Sidebar--toggleable-closed': !isOpen && isToggleable,
        },
        className,
      )}
    >
      <div className={classNames('Sidebar__ContentWrapper')}>
        <div
          style={{ width }}
          className={classNames(
            'Sidebar__Content',
            `Sidebar__Content--${position}`,
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
      <div
        className={classNames(
          'Sidebar__ResizeHandle',
          `Sidebar__ResizeHandle--${position === 'left' ? 'right' : 'left'}`,
          `Sidebar__ResizeHandle--${isOpen ? 'opened' : 'closed'}`,
        )}
        onMouseDown={onResizeStart}
      />
      <div
        onClick={onToggle}
        className={classNames(
          'Sidebar__ToggleButton',
          `Sidebar__ToggleButton--${position === 'left' ? 'right' : 'left'}`,
          {
            'Sidebar__ToggleButton--visible': isToggleable,
          },
        )}
      >
        <i className={`fa fa-angle-${toggleDirection}`} />
      </div>
    </div>
  );
};
