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

import React from 'react';

import { Sidebar } from './Sidebar';

interface ISidebarContainerProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  initialWidth?: number;
  maximumWidth?: number;
  minimumWidth?: number;
  isOpen: boolean;
  key?: string;
  onClose?: () => void;
  onOpen?: () => void;
  onToggle?: () => void;
  position: 'left' | 'right';
}

interface IResize {
  startX: number;
  startWidth: number;
}

interface ISidebarContainerState {
  width: number;
  resizing: IResize | null;
}

class SidebarContainer extends React.Component<
  ISidebarContainerProps,
  ISidebarContainerState
> {
  public state: ISidebarContainerState = {
    width: this.props.initialWidth || 200,
    resizing: null,
  };

  private outerElement: HTMLElement | null = null;

  public render() {
    const isToggleable = !!(
      this.props.onToggle ||
      (this.props.isOpen && this.props.onClose) ||
      (!this.props.isOpen && this.props.onOpen)
    );
    return (
      <Sidebar
        children={this.props.children}
        className={this.props.className}
        contentClassName={this.props.contentClassName}
        isOpen={this.props.isOpen}
        isResizing={this.state.resizing !== null}
        isToggleable={isToggleable}
        onResizeStart={this.onResizeStart}
        onToggle={this.onToggle}
        outerRef={this.outerRef}
        position={this.props.position}
        width={this.state.width}
      />
    );
  }

  public componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
  }

  public componentWillUnmount() {
    // Remove any mousemove listener
    document.body.removeEventListener('mousemove', this.onResizeMove);
    document.body.removeEventListener('mouseup', this.onResizeEnd);
    window.removeEventListener('resize', this.onWindowResize);
  }

  private onResizeStart = (e: React.MouseEvent<HTMLElement>) => {
    // Prevent text selection
    e.preventDefault();
    const resizing = {
      startX: e.clientX,
      startWidth: this.state.width,
    };
    // Set the state and register event listeners
    this.setState({ resizing }, () => {
      document.body.addEventListener('mousemove', this.onResizeMove);
      document.body.addEventListener('mouseup', this.onResizeEnd);
    });
  };

  private onResizeEnd = () => {
    document.body.removeEventListener('mousemove', this.onResizeMove);
    document.body.removeEventListener('mouseup', this.onResizeEnd);
    this.setState({ resizing: null });
  };

  private onResizeMove = (e: MouseEvent) => {
    if (this.state.resizing) {
      const { startX, startWidth } = this.state.resizing;
      const deltaX = e.clientX - startX;
      const deltaWidth = this.props.position === 'left' ? deltaX : -deltaX;
      const width = this.getBoundedWidth(startWidth + deltaWidth);
      // Set the width
      this.setState({
        width,
      });
    }
  };

  private onWindowResize = (e: Event) => {
    // When a window got resized, the width of the sidebar might have been reduced
    if (this.outerElement && this.props.isOpen) {
      const rect = this.outerElement.getBoundingClientRect();
      // The window was resized to a point where the Sidebar could no longer maintain its width
      if (rect.width < this.state.width) {
        // Try setting the width to the actual width of the sidebar after the resize - within bounds
        const width = this.getBoundedWidth(rect.width);
        this.setState({ width });
      }
    }
  };

  private onToggle = () => {
    if (this.props.isOpen && this.props.onClose) {
      this.props.onClose();
    } else if (!this.props.isOpen && this.props.onOpen) {
      this.props.onOpen();
    } else if (this.props.onToggle) {
      this.props.onToggle();
    }
  };

  private outerRef = (element: HTMLElement | null) => {
    this.outerElement = element;
  };

  private getBoundedWidth(width: number) {
    // Determine the maximum and minumum widths
    const maximumWidth = this.props.maximumWidth || Number.MAX_SAFE_INTEGER;
    const minimumWidth = this.props.minimumWidth || 10;
    // Return a width within the bounds
    return Math.max(Math.min(width, maximumWidth), minimumWidth);
  }
}

export { SidebarContainer as Sidebar };
export { Body as SidebarBody } from './Body';
export { Controls as SidebarControls } from './Controls';
export { Table as SidebarTable } from './Table';
export { Title as SidebarTitle } from './Title';
